import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { computeOrder, OrderError } from "./catalog";
import { isValidMobile, isValidPostal, normalizeDigits, PROVINCES } from "./iran";
import type { Json } from "@/integrations/supabase/types";

const lineSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("product"), productId: z.string().max(60), variantId: z.string().max(20), qty: z.number().int().min(1).max(20) }),
  z.object({ kind: z.literal("box"), sizeId: z.string().max(10), picks: z.array(z.string().max(60)).max(16), message: z.string().max(150), qty: z.number().int().min(1).max(20) }),
]);

const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(80),
  mobile: z.string().max(20),
  province: z.string().max(40),
  city: z.string().max(40),
  address: z.string().trim().min(10).max(400),
  postalCode: z.string().max(20),
  giftNote: z.string().max(300).default(""),
  shippingId: z.string().max(30),
  lines: z.array(lineSchema).min(1).max(30),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => orderSchema.parse(input))
  .handler(async ({ data }) => {
    const mobile = normalizeDigits(data.mobile);
    const postal = normalizeDigits(data.postalCode);
    if (!isValidMobile(mobile)) throw new Error("شمارهٔ موبایل معتبر نیست");
    if (!isValidPostal(postal)) throw new Error("کد پستی باید ۱۰ رقم باشد");
    if (!PROVINCES[data.province]?.includes(data.city)) throw new Error("استان یا شهر نامعتبر است");
    let summary;
    try {
      summary = computeOrder(data.lines, data.shippingId, data.province);
    } catch (e) {
      throw new Error(e instanceof OrderError ? e.message : "سفارش نامعتبر است");
    }
    const bytes = crypto.getRandomValues(new Uint8Array(4));
    const code = "AN" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("orders").insert({
      code,
      customer_name: data.customerName,
      mobile,
      province: data.province,
      city: data.city,
      address: data.address,
      postal_code: postal,
      gift_note: data.giftNote || null,
      items: { lines: summary.lines, raw: data.lines } as unknown as Json,
      shipping_method: summary.shippingLabel,
      shipping_cost: summary.shipping,
      subtotal: summary.subtotal,
      total: summary.total,
      payment_method: "card_to_card",
    });
    if (error) {
      console.error(error);
      throw new Error("ثبت سفارش ناموفق بود. لطفاً دوباره تلاش کنید.");
    }
    return { code, mobile };
  });

const lookupSchema = z.object({ code: z.string().min(4).max(20), mobile: z.string().max(20) });

export const getOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => lookupSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .select("code,status,customer_name,city,province,items,shipping_method,shipping_cost,subtotal,total,receipt_path,gift_note,created_at")
      .eq("code", data.code.toUpperCase())
      .eq("mobile", normalizeDigits(data.mobile))
      .maybeSingle();
    if (error) throw new Error("خطا در دریافت سفارش");
    if (!row) return null;
    const { receipt_path, ...rest } = row;
    return { ...rest, hasReceipt: !!receipt_path, items: row.items as unknown as { lines: { title: string; detail: string; qty: number; total: number }[] } };
  });

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export const uploadReceipt = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    lookupSchema.extend({ contentType: z.string(), base64: z.string().max(7_000_000) }).parse(input),
  )
  .handler(async ({ data }) => {
    if (!ALLOWED.includes(data.contentType)) throw new Error("فقط تصویر یا PDF قابل بارگذاری است");
    const bin = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    if (bin.byteLength > 5 * 1024 * 1024) throw new Error("حجم فایل باید کمتر از ۵ مگابایت باشد");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders").select("id,status").eq("code", data.code.toUpperCase()).eq("mobile", normalizeDigits(data.mobile)).maybeSingle();
    if (!order) throw new Error("سفارش یافت نشد");
    if (order.status !== "awaiting_payment" && order.status !== "receipt_submitted") throw new Error("برای این سفارش امکان ارسال رسید وجود ندارد");
    const ext = data.contentType === "application/pdf" ? "pdf" : data.contentType.split("/")[1];
    const path = `${order.id}/${Date.now()}.${ext}`;
    const up = await supabaseAdmin.storage.from("receipts").upload(path, bin, { contentType: data.contentType });
    if (up.error) { console.error(up.error); throw new Error("بارگذاری رسید ناموفق بود"); }
    await supabaseAdmin.from("orders").update({ receipt_path: path, status: "receipt_submitted", updated_at: new Date().toISOString() }).eq("id", order.id);
    return { ok: true };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ email: z.string().trim().email().max(200) }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("newsletter_subscribers").upsert({ email: data.email.toLowerCase() }, { onConflict: "email", ignoreDuplicates: true });
    if (error) throw new Error("ثبت ایمیل ناموفق بود");
    return { ok: true };
  });
