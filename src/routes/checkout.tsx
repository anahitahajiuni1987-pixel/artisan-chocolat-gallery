import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { availableShipping, priceLine, toman } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { PROVINCES } from "@/lib/iran";
import { createOrder } from "@/lib/orders.functions";
import { validateCheckout } from "@/lib/checkout-validation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "تکمیل خرید | آناهیتا" },
      { name: "description", content: "ثبت مشخصات ارسال و سفارش" },
      { property: "og:title", content: "تکمیل خرید آناهیتا" },
      { property: "og:description", content: "ثبت سفارش" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const field = "w-full border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-gold";

function Checkout() {
  const { lines, ready, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const send = useServerFn(createOrder);
  const [f, setF] = useState({ customerName: "", mobile: "", province: "", city: "", address: "", postalCode: "", giftNote: "", shippingId: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const ships = useMemo(() => availableShipping(f.province), [f.province]);
  const ship = ships.find((s) => s.id === f.shippingId);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  if (!ready) return <div className="container-lux min-h-[60vh] pt-40">در حال بارگذاری…</div>;
  if (lines.length === 0)
    return (
      <div className="container-lux flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <h1 className="text-3xl">سبد خرید خالی است</h1>
        <Link to="/shop" className="mt-6 rounded-sm bg-primary px-8 py-3 text-sm text-primary-foreground">رفتن به فروشگاه</Link>
      </div>
    );

  function validate() {
    const e = validateCheckout(f);
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) { toast.error("لطفاً خطاهای فرم را بررسی کنید"); return; }
    if (busy) return;
    setBusy(true);
    try {
      const res = await send({ data: { ...f, lines: lines.map(({ key: _k, ...l }) => l) } });
      clear();
      navigate({ to: "/order/$code", params: { code: res.code }, search: { m: res.mobile } });
    } catch (e) {
      toast.error((e as Error).message || "ثبت سفارش ناموفق بود");
    } finally {
      setBusy(false);
    }
  }

  const Err = ({ k }: { k: string }) => (errors[k] ? <p id={`error-${k}`} role="alert" className="mt-1 text-xs text-destructive">{errors[k]}</p> : null);

  return (
    <form onSubmit={submit} noValidate className="container-lux grid gap-14 pb-28 pt-32 md:pt-40 lg:grid-cols-12">
      <div className="space-y-10 lg:col-span-7">
        <h1 className="text-4xl md:text-5xl">تکمیل خرید</h1>
        <section className="grid gap-4 sm:grid-cols-2">
          <h2 className="font-sans text-sm font-semibold sm:col-span-2">مشخصات گیرنده</h2>
          <div><label htmlFor="customerName" className="mb-1 block text-sm">نام و نام خانوادگی</label><input id="customerName" aria-invalid={!!errors["customerName"]} aria-describedby={errors["customerName"] ? "error-customerName" : undefined} className={field} value={f.customerName} onChange={(e) => set("customerName", e.target.value)} /><Err k="customerName" /></div>
          <div><label htmlFor="mobile" className="mb-1 block text-sm">موبایل</label><input id="mobile" aria-invalid={!!errors["mobile"]} aria-describedby={errors["mobile"] ? "error-mobile" : undefined} className={field} dir="ltr" inputMode="numeric" placeholder="09xxxxxxxxx" value={f.mobile} onChange={(e) => set("mobile", e.target.value)} /><Err k="mobile" /></div>
          <div><label htmlFor="province" className="mb-1 block text-sm">استان</label>
            <select id="province" aria-invalid={!!errors["province"]} aria-describedby={errors["province"] ? "error-province" : undefined} className={field} value={f.province} onChange={(e) => setF((p) => ({ ...p, province: e.target.value, city: "", shippingId: "" }))}>
              <option value="">انتخاب کنید</option>
              {Object.keys(PROVINCES).map((p) => <option key={p}>{p}</option>)}
            </select><Err k="province" /></div>
          <div><label htmlFor="city" className="mb-1 block text-sm">شهر</label>
            <select id="city" aria-invalid={!!errors["city"]} aria-describedby={errors["city"] ? "error-city" : undefined} className={field} value={f.city} disabled={!f.province} onChange={(e) => set("city", e.target.value)}>
              <option value="">انتخاب کنید</option>
              {(PROVINCES[f.province] ?? []).map((c) => <option key={c}>{c}</option>)}
            </select><Err k="city" /></div>
          <div className="sm:col-span-2"><label htmlFor="address" className="mb-1 block text-sm">نشانی کامل</label><textarea id="address" aria-invalid={!!errors["address"]} aria-describedby={errors["address"] ? "error-address" : undefined} rows={3} className={field} value={f.address} onChange={(e) => set("address", e.target.value)} /><Err k="address" /></div>
          <div><label htmlFor="postalCode" className="mb-1 block text-sm">کد پستی (۱۰ رقم)</label><input id="postalCode" aria-invalid={!!errors["postalCode"]} aria-describedby={errors["postalCode"] ? "error-postalCode" : undefined} className={field} dir="ltr" inputMode="numeric" value={f.postalCode} onChange={(e) => set("postalCode", e.target.value)} /><Err k="postalCode" /></div>
          <div className="sm:col-span-2"><label htmlFor="giftNote" className="mb-1 block text-sm">یادداشت هدیه برای گیرنده (اختیاری)</label><textarea id="giftNote" aria-invalid={!!errors["giftNote"]} aria-describedby={errors["giftNote"] ? "error-giftNote" : undefined} rows={2} maxLength={300} className={field} value={f.giftNote} onChange={(e) => set("giftNote", e.target.value)} /></div>
        </section>
        <section>
          <h2 className="mb-4 font-sans text-sm font-semibold">روش ارسال</h2>
          {!f.province ? <p className="text-sm text-muted-foreground">ابتدا استان را انتخاب کنید.</p> : (
            <div className="space-y-3">
              {ships.map((s) => (
                <label key={s.id} className={cn("flex cursor-pointer items-center justify-between border p-4", f.shippingId === s.id ? "border-primary" : "border-border")}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="ship" checked={f.shippingId === s.id} onChange={() => set("shippingId", s.id)} />
                    <span><span className="block text-sm">{s.label}</span><span className="text-xs text-muted-foreground">{s.note}</span></span>
                  </span>
                  <span className="text-sm">{toman(s.cost)}</span>
                </label>
              ))}
            </div>
          )}
          <Err k="shippingId" />
        </section>
        <section>
          <h2 className="mb-4 font-sans text-sm font-semibold">روش پرداخت</h2>
          <label className="flex items-center gap-3 border border-primary p-4 text-sm"><input type="radio" checked readOnly /> کارت‌به‌کارت — پس از ثبت، رسید را بارگذاری می‌کنید</label>
          <div className="mt-3 flex items-center gap-3 border border-dashed border-border p-4 text-sm text-muted-foreground"><input type="radio" disabled /> درگاه زرین‌پال — هنوز فعال نشده است</div>
        </section>
      </div>
      <aside className="lg:col-span-5">
        <div className="sticky top-28 bg-secondary p-6">
          <h2 className="font-sans text-sm font-semibold">خلاصهٔ سفارش</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((l) => { const p = priceLine(l); return <li key={l.key} className="flex justify-between gap-3"><span>{p.title} × {p.qty.toLocaleString("fa-IR")}</span><span>{toman(p.total)}</span></li>; })}
          </ul>
          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span>جمع اقلام</span><span>{toman(subtotal)}</span></div>
            <div className="flex justify-between"><span>ارسال</span><span>{ship ? toman(ship.cost) : "—"}</span></div>
            <div className="flex justify-between pt-2 font-display text-xl"><span>مبلغ نهایی</span><span>{toman(subtotal + (ship?.cost ?? 0))}</span></div>
          </div>
          <Button type="submit" disabled={busy} className="mt-6 h-auto w-full whitespace-normal rounded-sm bg-primary py-3.5 text-sm text-primary-foreground hover:bg-burgundy disabled:opacity-50">
            {busy ? "در حال ثبت…" : "ثبت سفارش"}
          </Button>
        </div>
      </aside>
    </form>
  );
}
