import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, fa, getProductBySlug, toman } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { slug: product.slug };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getProductBySlug(loaderData.slug) : undefined;
    if (!p) return { meta: [{ title: "محصول یافت نشد | آناهیتا" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${p.name} | آناهیتا` },
        { name: "description", content: p.short },
        { property: "og:title", content: `${p.name} — آناهیتا` },
        { property: "og:description", content: p.short },
        { property: "og:type", content: "product" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const p = getProductBySlug(slug)!;
  const { add } = useCart();
  const [variantId, setVariantId] = useState(p.variants[0]!.id);
  const [qty, setQty] = useState(1);
  const v = p.variants.find((x) => x.id === variantId)!;
  const out = p.stock <= 0;
  const max = Math.min(20, p.stock);

  return (
    <div className="container-lux grid gap-12 pb-28 pt-28 md:grid-cols-2 md:gap-20 md:pt-36">
      <div className="bg-muted">
        <img src={p.image} alt={p.name} width={1024} height={1024} className="aspect-square w-full object-cover" />
      </div>
      <div className="md:pt-8">
        <nav className="text-xs text-muted-foreground" aria-label="مسیر">
          <Link to="/shop">فروشگاه</Link> / <Link to="/shop" search={{ cat: p.category }}>{CATEGORIES.find((c) => c.id === p.category)?.label}</Link>
        </nav>
        <p className="mt-6 font-latin text-lg italic text-muted-foreground">{p.latin}</p>
        <h1 className="text-4xl md:text-5xl">{p.name}</h1>
        <p className="mt-4 font-display text-2xl">{toman(v.price)}</p>
        <p className={cn("mt-2 text-sm", out ? "text-destructive" : "text-muted-foreground")}>
          {out ? "ناموجود — به‌زودی" : p.stock < 10 ? `فقط ${fa(p.stock)} عدد باقی مانده` : "موجود"}
        </p>
        <p className="mt-8 leading-8">{p.description}</p>

        <fieldset className="mt-8">
          <legend className="mb-3 text-sm text-muted-foreground">اندازه</legend>
          <div className="flex flex-wrap gap-2">
            {p.variants.map((x) => (
              <button key={x.id} onClick={() => setVariantId(x.id)} aria-pressed={x.id === variantId}
                className={cn("border px-4 py-2 text-sm", x.id === variantId ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary")}>
                {x.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-8 flex gap-3">
          <div className="flex items-center border border-border">
            <button className="p-3" onClick={() => setQty((q) => Math.min(max, q + 1))} aria-label="افزایش"><Plus className="h-4 w-4" /></button>
            <span className="w-8 text-center" aria-live="polite">{fa(qty)}</span>
            <button className="p-3" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="کاهش"><Minus className="h-4 w-4" /></button>
          </div>
          <button disabled={out}
            onClick={() => { add({ kind: "product", productId: p.id, variantId, qty }); toast.success("به سبد خرید اضافه شد"); }}
            className="flex-1 rounded-sm bg-primary py-3 text-sm text-primary-foreground transition hover:bg-burgundy disabled:cursor-not-allowed disabled:opacity-40">
            افزودن به سبد — {toman(v.price * qty)}
          </button>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm">
          <h2 className="font-sans text-sm font-semibold">ترکیبات</h2>
          <p className="mt-2 leading-7 text-muted-foreground">{p.ingredients}</p>
          {p.piecePrice !== null && (
            <p className="mt-6 text-muted-foreground">این طعم را در <Link to="/build" className="text-foreground underline">جعبهٔ دلخواه</Link> هم می‌توانید بگذارید.</p>
          )}
        </div>
      </div>
    </div>
  );
}
