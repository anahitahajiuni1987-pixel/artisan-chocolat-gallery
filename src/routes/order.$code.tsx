import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ORDER_STATUS, toman } from "@/lib/catalog";
import { getOrder, uploadReceipt } from "@/lib/orders.functions";

export const Route = createFileRoute("/order/$code")({
  validateSearch: (s: Record<string, unknown>): { m?: string | undefined } => ({ m: typeof s["m"] === "string" ? s["m"].slice(0, 20) : undefined }),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "وضعیت و رسید سفارش | آناهیتا" },
      { name: "description", content: "وضعیت سفارش و ارسال رسید پرداخت" },
      { property: "og:title", content: "پیگیری سفارش آناهیتا" },
      { property: "og:description", content: "وضعیت سفارش" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { code } = Route.useParams();
  const { m } = Route.useSearch();
  const fetchOrder = useServerFn(getOrder);
  const upload = useServerFn(uploadReceipt);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const q = useQuery({ queryKey: ["order", code, m], enabled: !!m, queryFn: () => fetchOrder({ data: { code, mobile: m ?? "" } }) });

  async function onFile(file: File) {
    if (!m) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("حجم فایل باید کمتر از ۵ مگابایت باشد"); return; }
    setBusy(true);
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      let bin = "";
      for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      await upload({ data: { code, mobile: m ?? "", contentType: file.type, base64: btoa(bin) } });
      toast.success("رسید ارسال شد");
      qc.invalidateQueries({ queryKey: ["order", code, m] });
    } catch (e) {
      toast.error((e as Error).message || "ارسال رسید ناموفق بود");
    } finally {
      setBusy(false);
    }
  }

  if (!m) return <div className="container-lux min-h-[60vh] pt-40"><p>برای مشاهدهٔ سفارش از <Link to="/order" className="underline">صفحهٔ پیگیری</Link> استفاده کنید.</p></div>;
  if (q.isLoading) return <div className="container-lux min-h-[60vh] pt-40 text-muted-foreground">در حال دریافت سفارش…</div>;
  if (q.isError) return <div className="container-lux min-h-[60vh] pt-40 text-destructive">خطا در دریافت سفارش. دوباره تلاش کنید.</div>;
  const o = q.data;
  if (!o) return <div className="container-lux min-h-[60vh] pt-40"><h1 className="text-3xl">سفارشی با این مشخصات پیدا نشد</h1><Link to="/order" className="mt-4 inline-block underline">تلاش دوباره</Link></div>;

  return (
    <div className="container-lux max-w-3xl pb-28 pt-32 md:pt-40">
      <p className="eyebrow mb-3">کد سفارش: <span dir="ltr">{o.code}</span></p>
      <h1 className="text-4xl">سفارش شما ثبت شد</h1>
      <p className="mt-3 inline-block bg-secondary px-3 py-1 text-sm">{ORDER_STATUS[o.status] ?? o.status}</p>

      {o.status === "awaiting_payment" || o.status === "receipt_submitted" ? (
        <section className="mt-10 border border-gold/60 bg-card p-6">
          <h2 className="font-sans text-base font-semibold">پرداخت کارت‌به‌کارت</h2>
          <p className="mt-3 text-sm leading-7">لطفاً مبلغ <strong>{toman(o.total)}</strong> را واریز کرده و تصویر رسید را بارگذاری کنید.</p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">شمارهٔ کارت فروشگاه هنوز ثبت نشده است؛ تا دریافت مشخصات واقعی از فروشگاه، وجهی واریز نکنید.</p>
          <label className="mt-5 inline-flex cursor-pointer rounded-sm bg-primary px-6 py-3 text-sm text-primary-foreground">
            {busy ? "در حال ارسال…" : o.hasReceipt ? "ارسال رسید جدید" : "بارگذاری رسید"}
            <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="sr-only" disabled={busy}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
          </label>
          {o.hasReceipt && <p className="mt-3 text-sm text-muted-foreground">رسید دریافت شد و در انتظار تأیید است.</p>}
        </section>
      ) : null}

      <section className="mt-10">
        <ul className="divide-y divide-border border-y border-border text-sm">
          {o.items.lines.map((l, i) => (
            <li key={i} className="flex justify-between gap-3 py-3"><span>{l.title} × {l.qty.toLocaleString("fa-IR")}<span className="block text-xs text-muted-foreground">{l.detail}</span></span><span>{toman(l.total)}</span></li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>ارسال ({o.shipping_method})</span><span>{toman(o.shipping_cost)}</span></div>
          <div className="flex justify-between font-display text-xl"><span>مبلغ نهایی</span><span>{toman(o.total)}</span></div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">ارسال به: {o.province}، {o.city}</p>
      </section>
    </div>
  );
}
