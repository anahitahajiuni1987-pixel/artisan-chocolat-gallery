import { Link, useLocation } from "@tanstack/react-router";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { fa } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/shop", label: "فروشگاه" },
  { to: "/story", label: "داستان ما" },
  { to: "/collections", label: "مجموعه‌ها" },
  { to: "/build", label: "ساخت جعبه" },
] as const;

export function Header() {
  const { pathname } = useLocation();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        overHero ? "bg-transparent text-cocoa-foreground" : "border-b border-border/70 bg-background/90 text-foreground backdrop-blur-md",
      )}
    >
      <div className="container-lux flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-baseline gap-3" aria-label="آناهیتا — خانه">
          <span className="font-latin text-2xl font-medium tracking-[0.35em] md:text-[1.7rem]">ANAHITA</span>
        </Link>
        <nav className="hidden items-center gap-9 md:flex" aria-label="ناوبری اصلی">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm opacity-85 transition-opacity hover:opacity-100" activeProps={{ className: "text-gold opacity-100" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative rounded-full p-2 transition-colors hover:text-gold" aria-label={`سبد خرید، ${fa(count)} مورد`}>
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-gold-foreground">
                {fa(count)}
              </span>
            )}
          </Link>
          <button className="rounded-full p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="منو" aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="container-lux flex flex-col gap-1 pb-6 md:hidden" aria-label="ناوبری موبایل">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="border-b border-border/60 py-3 font-display text-lg">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
