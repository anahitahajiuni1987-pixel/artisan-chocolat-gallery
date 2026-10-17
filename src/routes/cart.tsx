import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { BOX_SIZES, fa, getProduct, priceLine, toman } from "@/lib/catalog";
import { useCart, type CartLine } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "سبد خرید | آناهیتا" },
      { name: "description", content: "سبد خرید شکلات‌های آناهیتا" },
      { property: "og:title", content: "سبد خرید آناهیتا" },
      { property: "og:description", content: "سبد خرید شما" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function lineImage(l: CartLine) {
  if (l.kind === "product") return getProduct(l.productId)?.image;
  return getProduct(l.picks[0])?.image;
}

function CartPage() {
  const { lines, ready, setQty, remove, subtotal } = useCart();

  if (!ready) return <div className="container-lux min-h-[60vh] pt-40 text-muted-foreground">در حال بارگذاری…</div>;

  if (lines.length === 0)
    return (
      <div className="container-lux flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <h1 className="text-4xl">سبد خرید شما خالی است</h1>
        <p className="mt-3 text-muted-foreground">شکلات‌ها منتظر شما هستند.</p>
        <Link to="/shop" className="mt-8 rounded-sm bg-primary px-8 py-3 text-sm text-primary-foreground">رفتن به فروشگاه</Link>
      </div>
    );

  return (
    <div className="container-lux grid gap-14 pb-28 pt-32 md:pt-40 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <h1 className="text-4xl md:text-5xl">سبد خرید</h1>
        <ul className="mt-10 divide-y divide-border border-y border-border">
          {lines.map((l) => {
            const priced = priceLine(l);
            return (
              <li key={l.key} className="flex gap-5 py-6">
                <img src={lineImage(l)} alt="" width={96} height={96} className="h-24 w-24 shrink-0 object-cover" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-xl">{priced.title}</p>
                      <p className="truncate text-sm text-muted-foreground">{priced.detail}</p>
                      {l.kind === "box" && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {l.picks.map((id) => getProduct(id)?.name).join("، ")} — {BOX_SIZES.find((s) => s.id === l.sizeId)?.label}
                        </p>
                      )}
                    </div>
                    <p className="shrink-0 font-display text-lg">{toman(priced.total)}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-4 pt-3">
                    <div className="flex items-center border border-border">
                      <button className="p-2" onClick={() => setQty(l.key, l.qty + 1)} aria-label="افزایش"><Plus className="h-3.5 w-3.5" /></button>
                      <span className="w-7 text-center text-sm">{fa(l.qty)}</span>
                      <button className="p-2" onClick={() => setQty(l.key, l.qty - 1)} aria-label="کاهش"><Minus className="h-3.5 w-3.5" /></button>
                    </div>
                    <button onClick={() => remove(l.key)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /> حذف</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <aside className="lg:col-span-4">
        <div className="sticky top-28 bg-secondary p-6">
          <div className="flex justify-between"><span>جمع اقلام</span><span className="font-display text-xl">{toman(subtotal)}</span></div>
          <p className="mt-2 text-xs text-muted-foreground">هزینهٔ ارسال در مرحلهٔ بعد محاسبه می‌شود.</p>
          <Link to="/checkout" className="mt-6 block rounded-sm bg-primary py-3.5 text-center text-sm text-primary-foreground hover:bg-burgundy">ادامهٔ خرید</Link>
          <Link to="/shop" className="mt-3 block text-center text-sm underline-offset-4 hover:underline">افزودن شکلات‌های دیگر</Link>
        </div>
      </aside>
    </div>
  );
}
