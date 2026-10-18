import { describe, expect, it } from "vitest";
import { addCartLine, restoreCart, withQuantity } from "@/lib/cart-logic";
import { computeOrder, priceLine, type ProductLine } from "@/lib/catalog";
import { validateCheckout, type CheckoutFields } from "@/lib/checkout-validation";
import { isValidMobile, isValidPostal, normalizeDigits } from "@/lib/iran";
import { getPaymentGateway } from "@/lib/payments.server";

const product: ProductLine = { kind: "product", productId: "gold-leaf", variantId: "6", qty: 2 };
const valid: CheckoutFields = { customerName: "آناهیتا حاجیونی", mobile: "۰۹۱۲۳۴۵۶۷۸۹", province: "تهران", city: "تهران", address: "تهران، خیابان نمونه، پلاک ۱۲", postalCode: "۱۲۳۴۵۶۷۸۹۰", giftNote: "", shippingId: "tehran_express" };

describe("Toman shopping calculations", () => {
  it("calculates the current sample product total and Tehran delivery in toman", () => {
    expect(priceLine(product).total).toBe(2_900_000);
    expect(computeOrder([product], "tehran_express", "تهران")).toMatchObject({ subtotal: 2_900_000, shipping: 180_000, total: 3_080_000 });
  });
  it("includes all four selected chocolates and packaging in a custom box", () => {
    expect(priceLine({ kind: "box", sizeId: "s4", picks: ["gold-leaf", "saffron", "caramel", "rose"], message: "", qty: 2 }).total).toBe(2_620_000);
  });
  it("merges identical variants without combining different sizes", () => {
    const merged = addCartLine(addCartLine([], product), product);
    expect(merged).toHaveLength(1);
    expect(merged[0]?.qty).toBe(4);
    expect(addCartLine(merged, { ...product, variantId: "12" })).toHaveLength(2);
  });
  it("keeps quantity between one and the existing twenty-item limit", () => {
    expect(withQuantity(product, 0).qty).toBe(1);
    expect(withQuantity(product, 50).qty).toBe(20);
  });
  it("restores a usable cart and discards unavailable or malformed entries", () => {
    expect(restoreCart({})).toEqual([]);
    expect(restoreCart([null, { kind: "unknown" }, { ...product, productId: "yalda-box", variantId: "16" }, product])).toEqual([{ ...product, key: "p:gold-leaf:6" }]);
  });
});

describe("Iranian checkout rules", () => {
  it("accepts Persian and Arabic digits", () => {
    expect(normalizeDigits("٠٩١٢-۳۴۵ ۶۷۸۹")).toBe("09123456789");
    expect(validateCheckout(valid)).toEqual({});
  });
  it("requires an Iranian 09 mobile with eleven digits", () => {
    expect(isValidMobile("09123456789")).toBe(true);
    expect(isValidMobile("08123456789")).toBe(false);
    expect(isValidMobile("0912345678")).toBe(false);
  });
  it("requires a ten-digit postal code", () => {
    expect(isValidPostal("۱۲۳۴۵۶۷۸۹۰")).toBe(true);
    expect(isValidPostal("123456789")).toBe(false);
    expect(isValidPostal("12345abc90")).toBe(false);
  });
  it("restricts Tehran express to Tehran province", () => {
    expect(() => computeOrder([product], "tehran_express", "فارس")).toThrow();
    expect(validateCheckout({ ...valid, province: "فارس", city: "شیراز" })["shippingId"]).toBeDefined();
    expect(validateCheckout({ ...valid, province: "فارس", city: "شیراز", shippingId: "tipax" })).toEqual({});
  });
  it("requires a valid city within the selected province", () => {
    expect(validateCheckout({ ...valid, city: "شیراز" })["city"]).toBeDefined();
  });
  it("rejects incomplete recipient details", () => {
    expect(validateCheckout({ ...valid, customerName: "", address: "" })).toHaveProperty("customerName");
    expect(validateCheckout({ ...valid, address: "" })).toHaveProperty("address");
  });
});

describe("Unconnected Iranian gateway", () => {
  it("cannot initiate payments before a real integration exists", () => {
    expect(() => getPaymentGateway()).toThrow("درگاه پرداخت هنوز فعال نشده است");
  });
});