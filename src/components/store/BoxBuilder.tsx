import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { BOX_SIZES, MESSAGE_MAX, PRODUCTS, fa, getProduct, priceLine, toman } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PICKABLE = PRODUCTS.filter((p) => p.piecePrice !== null);

export function BoxBuilder() {
  const { add } = useCart();
  const navigate = useNavigate();
  const [sizeId, setSizeId] = useState<string>(BOX_SIZES[1].id);
  const [picks, setPicks] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const size = BOX_SIZES.find((s) => s.id === sizeId) ?? BOX_SIZES[1];
  const full = picks.length === size.pieces;

  const price = useMemo(() => {
    return size.base + picks.reduce((a, id) => a + (getProduct(id)?.piecePrice ?? 0), 0);
  }, [picks, size]);

  function choose(id: string) {
    if (full) { toast.message("جعبه پر است — برای جایگزینی یک قطعه را حذف کنید"); return; }
    setPicks((p) => [...p, id]);
  }
  function changeSize(id: string) {
    const s = BOX_SIZES.find((x) => x.id === id);
    if (!s) return;
    setSizeId(id);
    setPicks((p) => p.slice(0, s.pieces));
  }
  function addToCart() {
    const line = { kind: "box" as const, sizeId, picks, message: message.trim(), qty: 1 };
    try {
      priceLine(line);
    } catch (e) {
      toast.error((e as Error).message);
      return;
    }
    add(line);
    toast.success("جعبهٔ شما به سبد اضافه شد", { action: { label: "مشاهدهٔ سبد", onClick: () => navigate({ to: "/cart" }) } });
    setPicks([]);
    setMessage("");
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <fieldset>
          <legend className="mb-4 text-sm text-muted-foreground">۱. اندازهٔ جعبه</legend>
          <div className="grid grid-cols-3 gap-3">
            {BOX_SIZES.map((s) => (
              <Button variant="outline" key={s.id} type="button" onClick={() => changeSize(s.id)} aria-pressed={s.id === sizeId}
                className={cn("h-auto whitespace-normal border px-2 py-4 text-center transition", s.id === sizeId ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary")}>
                <span className="block font-display text-lg">{s.label}</span>
                <span className="mt-1 block text-xs opacity-75">جعبه: {toman(s.base)}</span>
              </Button>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-10">
          <legend className="mb-4 text-sm text-muted-foreground">۲. انتخاب شکلات‌ها ({fa(picks.length)} از {fa(size.pieces)})</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PICKABLE.map((p) => {
              const n = picks.filter((x) => x === p.id).length;
              return (
                <Button variant="outline" key={p.id} type="button" onClick={() => choose(p.id)} disabled={p.stock <= 0}
                  className="group relative flex h-auto flex-col items-start gap-2 whitespace-normal border border-border bg-card p-2 text-right sm:flex-row sm:items-center transition hover:border-gold disabled:opacity-40">
                  <img src={p.image} alt="" loading="lazy" width={64} height={64} className="h-14 w-14 rounded-full object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{p.name}</span>
                    <span className="block text-xs text-muted-foreground">{toman(p.piecePrice ?? 0)}</span>
                  </span>
                  {n > 0 && <span className="absolute top-1 left-1 rounded-full bg-gold px-1.5 text-[10px] text-gold-foreground">×{fa(n)}</span>}
                </Button>
              );
            })}
          </div>
        </fieldset>
        <div className="mt-10">
          <label htmlFor="gift-msg" className="mb-3 block text-sm text-muted-foreground">۳. پیام هدیه (اختیاری)</label>
          <textarea id="gift-msg" value={message} maxLength={MESSAGE_MAX} onChange={(e) => setMessage(e.target.value)} rows={3}
            placeholder="مثلاً: تولدت مبارک، با همهٔ مهر…" className="w-full resize-none border border-input bg-card p-3 text-sm outline-none focus:border-gold" />
          <p className="mt-1 text-left text-xs text-muted-foreground">{fa(message.length)} / {fa(MESSAGE_MAX)}</p>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="sticky top-28 bg-cocoa p-6 text-cocoa-foreground md:p-8">
          <p className="eyebrow">پیش‌نمایش جعبه</p>
          <div className="mt-5 border border-gold/50 bg-burgundy p-4">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size.cols}, minmax(0, 1fr))` }}>
              {Array.from({ length: size.pieces }, (_, i) => {
                const p = picks[i] ? getProduct(picks[i]) : undefined;
                return (
                  <Button variant="outline" key={i} type="button" disabled={!p} onClick={() => setPicks((x) => x.filter((_, j) => j !== i))}
                    aria-label={p ? `حذف ${p.name}` : "خانهٔ خالی"}
                    className="group relative h-auto w-full aspect-square rounded-full p-0 bg-cocoa/60 ring-1 ring-gold/25">
                    {p && (
                      <>
                        <img src={p.image} alt={p.name} className="h-full w-full rounded-full object-cover" />
                        <span className="absolute inset-0 hidden items-center justify-center rounded-full bg-cocoa/70 group-hover:flex"><X className="h-4 w-4" /></span>
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
          {message.trim() && (
            <p className="mt-5 border-r-2 border-gold pr-3 font-display text-lg leading-8 text-cocoa-foreground/90">«{message.trim()}»</p>
          )}
          <div className="mt-6 flex items-center justify-between border-t border-cocoa-muted/20 pt-5">
            <span className="text-sm text-cocoa-muted">مبلغ</span>
            <span className="font-display text-2xl">{toman(price)}</span>
          </div>
          <Button variant="outline" type="button" onClick={addToCart} disabled={!full}
            className="mt-5 h-auto w-full whitespace-normal rounded-sm bg-gold py-3.5 text-sm font-medium text-gold-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40">
            {full ? "افزودن به سبد" : `${fa(size.pieces - picks.length)} قطعهٔ دیگر انتخاب کنید`}
          </Button>
        </div>
      </div>
    </div>
  );
}
