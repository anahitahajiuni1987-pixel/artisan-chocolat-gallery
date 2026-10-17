import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import giftClosed from "@/assets/gift-closed.jpg";

const Hero3D = lazy(() => import("./Hero3D"));

type Mode = "pending" | "3d" | "static";

function StaticVisual() {
  return (
    <img src={giftClosed} alt="جعبهٔ هدیهٔ آناهیتا با روبان طلایی" width={1280} height={960}
      className="absolute inset-0 h-full w-full object-cover object-[35%_center] md:object-[20%_center]" />
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>("pending");
  const [offsetX, setOffsetX] = useState(-1.9);

  useEffect(() => {
    const w = window.innerWidth;
    setMode(w < 768 ? "static" : "3d");
    setOffsetX(w < 1100 ? -1.2 : -1.9);
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden text-cocoa-foreground" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0" aria-hidden={mode === "3d"}>
        {mode === "static" && <StaticVisual />}
        {mode === "3d" && (
          <Suspense fallback={null}>
            <Hero3D still={!!reduced} offsetX={offsetX} />
          </Suspense>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
      {mode === "static" && <div className="pointer-events-none absolute inset-0 bg-cocoa/55" />}

      <div className="container-lux pointer-events-none relative flex h-full flex-col justify-center">
        <motion.div
          className="pointer-events-auto max-w-xl"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-gold" /> شکلات‌های دست‌ساز آناهیتا
          </p>
          <h1 className="text-5xl leading-[1.25] md:text-7xl">
            تکه‌ای کوچک
            <br />
            <span className="text-gold">از هنر</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-cocoa-foreground/80 md:text-lg">
            شکلات‌هایی که با دست ساخته می‌شوند تا هر لحظه را به خاطره‌ای فراموش‌نشدنی بدل کنند.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/shop" className="rounded-sm bg-gold px-7 py-3.5 text-sm font-medium text-gold-foreground transition hover:brightness-110">
              کشف شکلات‌ها
            </Link>
            <Link to="/collections" className="rounded-sm border border-cocoa-foreground/40 px-7 py-3.5 text-sm transition hover:border-gold hover:text-gold">
              جعبه‌های هدیه
            </Link>
          </div>
        </motion.div>
      </div>
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-widest text-cocoa-foreground/50">
        اسکرول کنید
      </div>
    </section>
  );
}
