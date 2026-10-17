import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { CATEGORIES, PRODUCTS, type CategoryId } from "@/lib/catalog";
import { ProductCard } from "@/components/store/ProductCard";
import { cn } from "@/lib/utils";

type ShopSearch = { q?: string; cat?: CategoryId };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    q: typeof s.q === "string" && s.q ? s.q.slice(0, 60) : undefined,
    cat: CATEGORIES.some((c) => c.id === s.cat) ? (s.cat as CategoryId) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "فروشگاه | آناهیتا" },
      { name: "description", content: "همهٔ شکلات‌ها، ترافل‌ها و جعبه‌های هدیهٔ دست‌ساز آناهیتا با قیمت به تومان." },
      { property: "og:title", content: "فروشگاه آناهیتا" },
      { property: "og:description", content: "بن‌بن، ترافل و جعبه‌های هدیهٔ دست‌ساز" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { q, cat } = Route.useSearch();
  const navigate = Route.useNavigate();
  const term = (q ?? "").trim();
  const list = PRODUCTS.filter((p) => (!cat || p.category === cat) && (!term || `${p.name} ${p.short} ${p.latin}`.toLowerCase().includes(term.toLowerCase())));

  return (
    <div className="container-lux pb-28 pt-32 md:pt-40">
      <p className="eyebrow mb-3">فروشگاه</p>
      <h1 className="text-4xl md:text-6xl">شکلات‌های آناهیتا</h1>
      <div className="mt-10 flex flex-col gap-5 border-y border-border py-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="دسته‌بندی">
          <Link to="/shop" search={{ q }} className={cn("rounded-full border px-4 py-1.5 text-sm", !cat ? "border-primary bg-primary text-primary-foreground" : "border-border")}>همه</Link>
          {CATEGORIES.map((c) => (
            <Link key={c.id} to="/shop" search={{ q, cat: c.id }} className={cn("rounded-full border px-4 py-1.5 text-sm", cat === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary")}>{c.label}</Link>
          ))}
        </div>
        <label className="flex items-center gap-2 border-b border-input pb-1 md:w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">جست‌وجو</span>
          <input value={q ?? ""} onChange={(e) => navigate({ search: { cat, q: e.target.value || undefined }, replace: true })}
            placeholder="جست‌وجوی طعم…" className="w-full bg-transparent py-1 text-sm outline-none" />
        </label>
      </div>
      {list.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl">محصولی پیدا نشد</p>
          <p className="mt-2 text-sm text-muted-foreground">عبارت دیگری را امتحان کنید یا فیلترها را بردارید.</p>
          <Link to="/shop" className="mt-6 inline-block text-sm underline">نمایش همه</Link>
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
