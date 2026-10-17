import { createFileRoute } from "@tanstack/react-router";
import { BoxBuilder } from "@/components/store/BoxBuilder";

export const Route = createFileRoute("/build")({
  head: () => ({
    meta: [
      { title: "ساخت جعبهٔ دلخواه | آناهیتا" },
      { name: "description", content: "اندازهٔ جعبه را انتخاب کنید، طعم‌ها را بچینید و پیام هدیهٔ شخصی بنویسید." },
      { property: "og:title", content: "جعبهٔ دلخواه آناهیتا" },
      { property: "og:description", content: "جعبهٔ شکلات شخصی با پیام هدیه" },
    ],
  }),
  component: () => (
    <div className="container-lux pb-28 pt-32 md:pt-40">
      <p className="eyebrow mb-3">جعبهٔ دلخواه</p>
      <h1 className="mb-14 text-4xl md:text-6xl">جعبهٔ خودتان را بسازید</h1>
      <BoxBuilder />
    </div>
  ),
});
