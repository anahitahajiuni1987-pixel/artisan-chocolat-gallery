import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { subscribeNewsletter } from "@/lib/orders.functions";

const FAQ = [
  { q: "سفارش‌ها چگونه ارسال می‌شوند؟", a: "در استان تهران با پیک ویژه و در سراسر کشور با تیپاکس یا پست پیشتاز. شکلات‌ها در بسته‌بندی محافظ ارسال می‌شوند." },
  { q: "پرداخت چگونه انجام می‌شود؟", a: "در حال حاضر پرداخت به‌صورت کارت‌به‌کارت است و پس از ثبت سفارش، رسید را در صفحهٔ پیگیری سفارش بارگذاری می‌کنید. درگاه پرداخت آنلاین به‌زودی اضافه می‌شود." },
  { q: "شکلات‌ها را چگونه نگهداری کنم؟", a: "در جای خشک و خنک (حدود ۱۴ تا ۱۸ درجه) و دور از نور مستقیم. از نگهداری در یخچال خودداری کنید." },
  { q: "می‌توانم پیام هدیه اضافه کنم؟", a: "بله. هنگام ساخت جعبهٔ دلخواه یا در مرحلهٔ تکمیل خرید می‌توانید یادداشتی برای گیرنده بنویسید." },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const subscribe = useServerFn(subscribeNewsletter);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("ایمیل معتبر وارد کنید");
    setBusy(true);
    try {
      await subscribe({ data: { email } });
      toast.success("ایمیل شما ثبت شد");
      setEmail("");
    } catch {
      toast.error("ثبت ایمیل ناموفق بود");
    } finally {
      setBusy(false);
    }
  }

  return (
    <footer className="bg-cocoa text-cocoa-foreground">
      <div className="container-lux grid gap-14 py-20 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-latin text-3xl tracking-[0.35em]">ANAHITA</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-cocoa-muted">شکلات‌های دست‌ساز و جعبه‌های هدیه، ساخته‌شده با حوصله برای لحظه‌هایی که می‌مانند.</p>
          <form onSubmit={onSubmit} className="mt-8 max-w-sm">
            <label htmlFor="nl" className="text-sm">خبرنامه — از مجموعه‌های فصلی باخبر شوید</label>
            <div className="mt-3 flex border-b border-cocoa-muted/40 focus-within:border-gold">
              <input id="nl" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com"
                className="w-full bg-transparent py-3 text-sm text-right outline-none placeholder:text-cocoa-muted/60" />
              <button disabled={busy} className="px-2 text-sm text-gold disabled:opacity-50">عضویت</button>
            </div>
          </form>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm md:col-span-3">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">فروشگاه</p>
            <Link to="/shop" className="hover:text-gold">همهٔ شکلات‌ها</Link>
            <Link to="/collections" className="hover:text-gold">جعبه‌های هدیه</Link>
            <Link to="/build" className="hover:text-gold">ساخت جعبه</Link>
            <Link to="/order" className="hover:text-gold">پیگیری سفارش</Link>
          </div>
          <div className="flex flex-col gap-3">
            <p className="eyebrow">آناهیتا</p>
            <Link to="/story" className="hover:text-gold">داستان ما</Link>
            <span className="text-cocoa-muted">ارسال: پیک تهران، تیپاکس، پست پیشتاز</span>
            <span className="text-cocoa-muted">تماس و شبکه‌های اجتماعی: به‌زودی</span>
          </div>
        </div>
        <div className="md:col-span-5">
          <p className="eyebrow mb-2">پرسش‌های پرتکرار</p>
          <Accordion type="single" collapsible>
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`} className="border-cocoa-muted/25">
                <AccordionTrigger className="text-right text-sm hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-cocoa-muted">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      <div className="border-t border-cocoa-muted/15">
        <div className="container-lux flex flex-col justify-between gap-2 py-6 text-xs text-cocoa-muted md:flex-row">
          <span>© آناهیتا — شکلات دست‌ساز</span>
          <span>قیمت‌ها به تومان است</span>
        </div>
      </div>
    </footer>
  );
}
