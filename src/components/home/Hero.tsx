import { Link } from "@tanstack/react-router";
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import giftClosed from "@/assets/gift-closed.jpg";

const Hero3D = lazy(() => import("./Hero3D"));

class VisualBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? <StaticVisual /> : this.props.children; }
}

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
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const update = () => {
      let supported = false;
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2");
        supported = !!gl;
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch { /* use photo when WebGL is unavailable */ }
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      setMode(window.innerWidth < 768 || reduced || connection?.saveData || !supported ? "static" : "3d");
      setOffsetX(window.innerWidth < 1100 ? -1.2 : -1.9);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [reduced]);

  useEffect(() => {
    let visible = true;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = !!entry?.isIntersecting; update(); });
    if (section.current) observer.observe(section.current);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  return (
    <section ref={section} className="relative h-[92svh] min-h-[540px] md:min-h-[560px] overflow-hidden text-cocoa-foreground" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0" aria-hidden={mode === "3d"}>
        {mode !== "3d" && <StaticVisual />}
        {mode === "3d" && (
          <VisualBoundary><Suspense fallback={<StaticVisual />}>
            <Hero3D still={!!reduced} offsetX={offsetX} active={active} fallback={<StaticVisual />} />
          </Suspense></VisualBoundary>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
      {mode === "static" && <div className="pointer-events-none absolute inset-0 bg-cocoa/55" />}

      <div className="container-lux pointer-events-none relative flex h-full pt-16 flex-col justify-center">
        <motion.div
          className="pointer-events-auto max-w-xl"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 1.4, delay: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
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
