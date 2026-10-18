import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { PRODUCTS } from "@/lib/catalog";
import { useCompactLayout } from "@/hooks/use-compact-layout";
import { ProductCard } from "@/components/store/ProductCard";
import giftOpen from "@/assets/gift-open.jpg";
import giftClosed from "@/assets/gift-closed.jpg";
import craftPour from "@/assets/craft-pour.jpg";
import craftHands from "@/assets/craft-hands.jpg";
import cherry from "@/assets/p-cherry.jpg";
import caramel from "@/assets/p-caramel.jpg";
import goldLeaf from "@/assets/p-gold-leaf.jpg";
import saffron from "@/assets/p-saffron.jpg";
import rose from "@/assets/p-rose.jpg";
import pistachio from "@/assets/p-pistachio-rose.jpg";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }} transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function Heading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <Reveal className="max-w-2xl">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="text-4xl md:text-5xl">{title}</h2>
      {text && <p className="mt-5 leading-8 text-muted-foreground">{text}</p>}
    </Reveal>
  );
}

export function SignatureCollection() {
  const items = PRODUCTS.filter((p) => p.category === "bonbon" || p.category === "truffle");
  return (
    <section className="container-lux py-28 md:py-36">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Heading eyebrow="۰۱ — مجموعهٔ امضا" title="بن‌بن‌هایی که با دست کشیده می‌شوند" text="هر قطعه طعمی مستقل دارد؛ از زعفران و گلاب تا کارامل و آلبالو." />
        <Link to="/shop" className="text-sm underline-offset-8 hover:underline">مشاهدهٔ همهٔ شکلات‌ها ←</Link>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.12}><ProductCard product={p} /></Reveal>
        ))}
      </div>
    </section>
  );
}

const FLY = [goldLeaf, saffron, rose, pistachio];

export function ExperienceSequence() {
  const compact = useCompactLayout();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const staticSequence = reduced || compact;
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const lidY = useTransform(p, [0.08, 0.45], ["0%", "-118%"]);
  const lidRot = useTransform(p, [0.08, 0.45], [0, -6]);
  const scale = useTransform(p, [0, 0.5], [0.9, 1]);
  const t1 = useTransform(p, [0, 0.18, 0.3], [1, 1, 0]);
  const t2 = useTransform(p, [0.42, 0.58], [0, 1]);
  const flyIn = useTransform(p, [0.55, 0.85], [1, 0]);
  const flyOp = useTransform(p, [0.55, 0.75], [0, 1]);

  return (
    <section ref={ref} className="relative bg-cocoa text-cocoa-foreground" style={{ height: staticSequence ? "auto" : "260vh" }}>
      <div className={staticSequence ? "py-24" : "sticky top-0 flex h-screen items-center overflow-hidden"}>
        <div className="container-lux grid items-center gap-12 md:grid-cols-12">
          <div className="relative md:col-span-4">
            <p className="eyebrow mb-4">۰۲ — تجربهٔ شکلات</p>
            <motion.div style={staticSequence ? {} : { opacity: t1 }}>
              <h2 className="text-4xl md:text-5xl">لحظهٔ گشودن</h2>
              <p className="mt-5 leading-8 text-cocoa-muted">روبان باز می‌شود، درِ جعبه بالا می‌رود و عطر کاکائو پیش از هر چیز به استقبال می‌آید.</p>
            </motion.div>
            <motion.div style={staticSequence ? {} : { opacity: t2 }} className={staticSequence ? "mt-8" : "absolute inset-x-0 top-10"}>
              <h2 className="text-4xl md:text-5xl">و سپس، <span className="text-gold">کشف</span></h2>
              <p className="mt-5 leading-8 text-cocoa-muted">دوازده قطعه، هر کدام با شخصیتی متفاوت، در کنار هم چیده شده‌اند تا آرام‌آرام چشیده شوند.</p>
            </motion.div>
          </div>
          <div className="md:col-span-8">
            <motion.div style={staticSequence ? {} : { scale }} className="relative mx-auto aspect-[1280/670] w-full max-w-3xl">
              <img src={giftOpen} alt="جعبهٔ باز آناهیتا با دوازده شکلات" loading="lazy" width={1280} height={670}
                className="absolute inset-0 h-full w-full object-cover shadow-[var(--shadow-lux)]" />
              {!staticSequence && (
                <motion.div style={{ y: lidY, rotate: lidRot }}
                  className="absolute inset-0 flex items-center justify-center bg-burgundy shadow-[var(--shadow-lux)]">
                  <div className="absolute inset-3 border border-gold/60" />
                  <div className="text-center">
                    <p className="font-latin text-4xl tracking-[0.4em] text-gold md:text-5xl">ANAHITA</p>
                    <p className="mt-3 text-xs tracking-widest text-burgundy-foreground/70">شکلات دست‌ساز</p>
                  </div>
                </motion.div>
              )}
              {!staticSequence && FLY.map((src, i) => <FlyImg key={i} src={src} i={i} progress={flyIn} opacity={flyOp} />)}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlyImg({ src, i, progress, opacity }: { src: string; i: number; progress: MotionValue<number>; opacity: MotionValue<number> }) {
  const side = i % 2 === 0 ? 1 : -1;
  const x = useTransform(progress, (n) => n * side * (140 + i * 30));
  const y = useTransform(progress, (n) => n * (i < 2 ? -80 : 80));
  const pos = ["-top-10 -right-6", "-top-12 left-10", "-bottom-10 right-16", "-bottom-8 -left-6"][i];
  return (
    <motion.img src={src} alt="" loading="lazy" width={200} height={200} style={{ opacity, x, y }}
      className={`absolute h-20 w-20 rounded-full object-cover ring-2 ring-gold/50 md:h-28 md:w-28 ${pos}`} />
  );
}

export function CraftedByHand() {
  const steps = [
    { t: "ریختن", d: "شکلات با دمای دقیق آماده و آرام در قالب‌ها ریخته می‌شود تا پوسته‌ای براق و ترد بسازد." },
    { t: "پرداخت دستی", d: "هر قطعه با دست پر، بسته و با برگ طلا یا گلبرگ تزئین می‌شود." },
    { t: "گرد کاکائو", d: "ترافل‌ها در پودر کاکائو غلتانده می‌شوند؛ لایه‌ای مخملی برای اولین لمس." },
  ];
  return (
    <section className="container-lux grid gap-14 py-28 md:grid-cols-12 md:py-40">
      <div className="md:col-span-5 md:pt-16">
        <Heading eyebrow="۰۳ — ساخته‌شده با دست" title="هنری که حوصله می‌خواهد" text="در آناهیتا هیچ قطعه‌ای از خط تولید بیرون نمی‌آید. هر شکلات از چند مرحلهٔ دستی می‌گذرد." />
        <ol className="mt-12 space-y-8">
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.1}>
              <li className="flex gap-5 border-t border-border pt-6">
                <span className="font-latin text-2xl text-gold">0{i + 1}</span>
                <div><h3 className="text-xl">{s.t}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{s.d}</p></div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
      <div className="grid grid-cols-2 gap-5 md:col-span-7">
        <Reveal><img src={craftPour} alt="ریختن شکلات مذاب در قالب" loading="lazy" width={1024} height={1280} className="aspect-[4/5] w-full object-cover" /></Reveal>
        <Reveal delay={0.15} className="mt-20"><img src={craftHands} alt="تزئین پرالین‌ها با برگ طلا" loading="lazy" width={1024} height={1280} className="aspect-[4/5] w-full object-cover" /></Reveal>
      </div>
    </section>
  );
}

const MOMENTS = [
  { t: "عاشقانه و ولنتاین", d: "قلب‌های آلبالو و بن‌بن‌های شرابی", img: cherry, to: "/shop", cat: "bonbon" },
  { t: "سالگرد ازدواج", d: "جعبهٔ امضا با منتخب طعم‌ها", img: giftOpen, to: "/shop", cat: "giftbox" },
  { t: "تولد", d: "کارامل، پسته و طعم‌های شاد", img: caramel, to: "/shop", cat: "bonbon" },
  { t: "یلدا، نوروز و کریسمس", d: "مجموعه‌های فصلی و محدود", img: giftClosed, to: "/shop", cat: "seasonal" },
] as const;

export function GiftsForMoments() {
  return (
    <section className="bg-secondary py-28 md:py-36">
      <div className="container-lux">
        <Heading eyebrow="۰۴ — هدیه برای هر لحظه" title="هر مناسبت، یک جعبه" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {MOMENTS.map((m, i) => (
            <Reveal key={m.t} delay={i * 0.08}>
              <Link to={m.to} search={{ cat: m.cat }} className="group block">
                <div className="overflow-hidden"><img src={m.img} alt={m.t} loading="lazy" width={800} height={1000} className="aspect-[3/4] w-full object-cover transition-transform duration-1000 group-hover:scale-105" /></div>
                <h3 className="mt-4 text-lg">{m.t}</h3>
                <p className="text-sm text-muted-foreground">{m.d}</p>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={0.32}>
            <Link to="/build" className="group flex aspect-[3/4] flex-col justify-end bg-burgundy p-6 text-burgundy-foreground">
              <span className="font-latin text-5xl text-gold">+</span>
              <h3 className="mt-4 text-lg">جعبهٔ شخصی‌سازی‌شده</h3>
              <p className="text-sm text-burgundy-foreground/70">طعم‌ها را خودتان انتخاب کنید و پیامتان را بنویسید.</p>
              <span className="mt-4 text-sm text-gold group-hover:underline">ساخت جعبه ←</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function BrandStory() {
  const pillars = [
    { t: "هنر", d: "هر مجموعه مثل یک قطعهٔ کوچک طراحی می‌شود؛ رنگ، فرم و طعم در کنار هم." },
    { t: "مواد اولیه", d: "مواد با دقت انتخاب می‌شوند و فهرست کامل ترکیبات هر محصول در صفحهٔ آن آمده است." },
    { t: "دست انسان", d: "از قالب تا بسته‌بندی، هر مرحله با دست و در دسته‌های کوچک انجام می‌شود." },
    { t: "لمس شخصی", d: "پیام شما روی کارتی همراه جعبه به گیرنده می‌رسد." },
  ];
  return (
    <section className="container-lux py-28 md:py-36">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="eyebrow mb-4">۰۶ — داستان آناهیتا</p>
        <h2 className="text-4xl leading-[1.5] md:text-5xl">نامی از الههٔ آب و باروری، برای شکلاتی که <span className="text-burgundy">آرام و با عشق</span> ساخته می‌شود.</h2>
      </Reveal>
      <div className="mt-20 grid gap-10 border-t border-border pt-12 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p, i) => (
          <Reveal key={p.t} delay={i * 0.1}>
            <h3 className="text-2xl">{p.t}</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{p.d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-cocoa text-cocoa-foreground">
      <img src={giftClosed} alt="" loading="lazy" width={1280} height={960} className="absolute inset-0 h-full w-full object-cover object-[25%_center] opacity-70" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-veil)" }} />
      <div className="container-lux relative py-36 md:py-48">
        <Reveal className="max-w-lg">
          <p className="eyebrow mb-4">۰۷</p>
          <h2 className="text-4xl md:text-6xl">هدیه‌ای که در خاطر می‌ماند</h2>
          <p className="mt-5 leading-8 text-cocoa-foreground/80">جعبه‌ای انتخاب کنید، پیامی بنویسید و بقیه را به ما بسپارید.</p>
          <Link to="/shop" className="mt-10 inline-flex rounded-sm bg-gold px-8 py-4 text-sm font-medium text-gold-foreground hover:brightness-110">خرید شکلات‌ها</Link>
        </Reveal>
      </div>
    </section>
  );
}
