import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { priceLine, type CartLineInput } from "./catalog";

export type CartLine = CartLineInput & { key: string };

type CartCtx = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  subtotal: number;
  add: (line: CartLineInput) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "anahita-cart-v1";

function lineKey(l: CartLineInput) {
  return l.kind === "product" ? `p:${l.productId}:${l.variantId}` : `b:${l.sizeId}:${l.picks.join(",")}:${l.message}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        setLines(parsed.filter((l) => { try { priceLine(l); return true; } catch { return false; } }));
      }
    } catch { /* ignore corrupt cart */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback((line: CartLineInput) => {
    const key = lineKey(line);
    setLines((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(20, l.qty + line.qty) } : l));
      return [...prev, { ...line, key }];
    });
  }, []);
  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(20, qty)) } : l)));
  }, []);
  const remove = useCallback((key: string) => setLines((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    let subtotal = 0;
    for (const l of lines) { try { subtotal += priceLine(l).total; } catch { /* skip */ } }
    return { lines, ready, add, setQty, remove, clear, subtotal, count: lines.reduce((a, l) => a + l.qty, 0) };
  }, [lines, ready, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
