import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/order/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "پیگیری سفارش | آناهیتا" },
      { name: "description", content: "با کد سفارش و شمارهٔ موبایل، وضعیت سفارش را ببینید." },
      { property: "og:title", content: "پیگیری سفارش آناهیتا" },
      { property: "og:description", content: "پیگیری سفارش" },
    ],
  }),
  component: Lookup,
});

function Lookup() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [m, setM] = useState("");
  return (
    <div className="container-lux max-w-md pb-28 pt-36">
      <h1 className="text-4xl">پیگیری سفارش</h1>
      <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); if (code && m) navigate({ to: "/order/$code", params: { code: code.trim().toUpperCase() }, search: { m: m.trim() } }); }}>
        <input dir="ltr" placeholder="کد سفارش (مثلاً AN1A2B3C4D)" value={code} onChange={(e) => setCode(e.target.value)} className="w-full border border-input bg-card px-3 py-2.5 text-sm" />
        <input dir="ltr" inputMode="numeric" placeholder="09xxxxxxxxx" value={m} onChange={(e) => setM(e.target.value)} className="w-full border border-input bg-card px-3 py-2.5 text-sm" />
        <button className="w-full rounded-sm bg-primary py-3 text-sm text-primary-foreground">مشاهدهٔ سفارش</button>
      </form>
    </div>
  );
}
