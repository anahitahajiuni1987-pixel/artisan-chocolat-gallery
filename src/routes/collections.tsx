import { createFileRoute } from "@tanstack/react-router";
import { GiftsForMoments } from "@/components/home/Sections";
import { ProductCard } from "@/components/store/ProductCard";
import { PRODUCTS } from "@/lib/catalog";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "مجموعه‌ها و جعبه‌های هدیه | آناهیتا" },
      { name: "description", content: "جعبه‌های هدیه برای سالگرد، تولد، ولنتاین، یلدا و نوروز." },
      { property: "og:title", content: "مجموعه‌های هدیهٔ آناهیتا" },
      { property: "og:description", content: "هدیه برای هر لحظه" },
    ],
  }),
  component: () => (
    <div className="pt-20">
      <div className="container-lux py-16">
        <p className="eyebrow mb-3">مجموعه‌ها</p>
        <h1 className="text-4xl md:text-6xl">جعبه‌های هدیه</h1>
        <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.filter((p) => p.category === "giftbox" || p.category === "seasonal").map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
      <GiftsForMoments />
    </div>
  ),
});
