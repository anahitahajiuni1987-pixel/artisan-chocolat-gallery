import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { toman, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const v = product.variants[0]!;
  const out = product.stock <= 0;
  return (
    <article className="group">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} loading="lazy" width={1024} height={1024}
          className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
      </Link>
      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <p className="font-latin text-sm italic text-muted-foreground">{product.latin}</p>
          <h3 className="mt-1 text-xl">
            <Link to="/product/$slug" params={{ slug: product.slug }}>{product.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{out ? "ناموجود" : `از ${toman(v.price)}`}</p>
        </div>
        <button
          disabled={out}
          onClick={() => {
            add({ kind: "product", productId: product.id, variantId: v.id, qty: 1 });
            toast.success(`${product.name} به سبد اضافه شد`);
          }}
          className="flex shrink-0 items-center gap-1 rounded-sm border border-foreground/25 px-3 py-2 text-xs transition hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`افزودن سریع ${product.name}`}
        >
          <Plus className="h-3.5 w-3.5" /> افزودن سریع
        </button>
      </div>
    </article>
  );
}
