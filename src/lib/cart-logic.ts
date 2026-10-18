import { getProduct, priceLine, type CartLineInput } from "./catalog";

export type CartLine = CartLineInput & { key: string };

export function lineKey(line: CartLineInput) {
  return line.kind === "product"
    ? `p:${line.productId}:${line.variantId}`
    : `b:${line.sizeId}:${line.picks.join(",")}:${line.message}`;
}

export function quantityLimit(line: CartLineInput) {
  return line.kind === "product" ? Math.min(20, getProduct(line.productId)?.stock ?? 0) : 20;
}

export function withQuantity(line: CartLineInput, qty: number): CartLine {
  if (!Number.isFinite(qty)) throw new Error("تعداد نامعتبر است");
  const next = { ...line, qty: Math.max(1, Math.min(quantityLimit(line), Math.trunc(qty))) };
  priceLine(next);
  return { ...next, key: lineKey(next) };
}

export function addCartLine(lines: CartLine[], line: CartLineInput): CartLine[] {
  const next = withQuantity(line, line.qty);
  const found = lines.find((item) => item.key === next.key);
  return found
    ? lines.map((item) => item.key === next.key ? withQuantity(item, item.qty + next.qty) : item)
    : [...lines, next];
}

export function restoreCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.reduce<CartLine[]>((lines, item) => {
    try {
      if (!item || (item.kind !== "product" && item.kind !== "box")) return lines;
      priceLine(item);
      return addCartLine(lines, item);
    } catch { return lines; }
  }, []);
}