import { createFileRoute } from "@tanstack/react-router";
import { BrandStory, CraftedByHand, FinalCTA } from "@/components/home/Sections";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "داستان ما | آناهیتا" },
      { name: "description", content: "هنر، مواد اولیه و دست‌هایی که شکلات‌های آناهیتا را می‌سازند." },
      { property: "og:title", content: "داستان آناهیتا" },
      { property: "og:description", content: "شکلاتی که آرام و با دست ساخته می‌شود" },
    ],
  }),
  component: () => (
    <div className="pt-20">
      <BrandStory />
      <CraftedByHand />
      <FinalCTA />
    </div>
  ),
});
