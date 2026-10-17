import goldLeaf from "@/assets/p-gold-leaf.jpg";
import saffron from "@/assets/p-saffron.jpg";
import pistachioRose from "@/assets/p-pistachio-rose.jpg";
import caramel from "@/assets/p-caramel.jpg";
import rose from "@/assets/p-rose.jpg";
import cherry from "@/assets/p-cherry.jpg";
import giftOpen from "@/assets/gift-open.jpg";
import giftClosed from "@/assets/gift-closed.jpg";
import { TEHRAN } from "./iran";

export type CategoryId = "bonbon" | "truffle" | "giftbox" | "seasonal";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "bonbon", label: "بن‌بن" },
  { id: "truffle", label: "ترافل" },
  { id: "giftbox", label: "جعبه‌های هدیه" },
  { id: "seasonal", label: "فصلی" },
];

export type Variant = { id: string; label: string; price: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  latin: string;
  category: CategoryId;
  short: string;
  description: string;
  ingredients: string;
  image: string;
  variants: Variant[];
  /** Price of one piece inside a custom box; null = not available for custom boxes. */
  piecePrice: number | null;
  stock: number;
};

// NOTE: all prices and stock levels are placeholders until the owner provides real values.
export const PRODUCTS: Product[] = [
  {
    id: "gold-leaf", slug: "gold-leaf-bonbon", name: "بن‌بن برگ طلا", latin: "Feuille d'Or",
    category: "bonbon", short: "گاناش شکلات تلخ با تزئین برگ طلای خوراکی",
    description: "پوسته‌ای براق از شکلات تلخ که گاناشی نرم و عمیق را در خود جای داده و با تکه‌هایی از برگ طلای خوراکی به دست پرداخت شده است.",
    ingredients: "شکلات تلخ، خامه، کره، برگ طلای خوراکی",
    image: goldLeaf, piecePrice: 240000, stock: 40,
    variants: [{ id: "6", label: "جعبه ۶ عددی", price: 1450000 }, { id: "12", label: "جعبه ۱۲ عددی", price: 2750000 }],
  },
  {
    id: "saffron", slug: "saffron-truffle", name: "ترافل زعفران", latin: "Saffron Truffle",
    category: "truffle", short: "ترافل کاکائویی با مغز گاناش زعفرانی",
    description: "ترافلی غلتیده در پودر کاکائو با قلبی طلایی از گاناش زعفران؛ ادای احترامی به عطر آشنای آشپزخانه‌های ایرانی.",
    ingredients: "شکلات سفید و تلخ، خامه، زعفران، پودر کاکائو",
    image: saffron, piecePrice: 260000, stock: 30,
    variants: [{ id: "6", label: "جعبه ۶ عددی", price: 1550000 }, { id: "12", label: "جعبه ۱۲ عددی", price: 2950000 }],
  },
  {
    id: "pistachio-rose", slug: "pistachio-bonbon", name: "پسته و گلاب", latin: "Pistache & Rose",
    category: "bonbon", short: "پرالین پسته با رایحهٔ ملایم گلاب",
    description: "پوسته‌ای مرمری به رنگ شرابی که پرالین پستهٔ برشته و نوای ملایم گلاب را در بر گرفته است.",
    ingredients: "شکلات تلخ، پسته، شکر، گلاب، کره کاکائو",
    image: pistachioRose, piecePrice: 250000, stock: 25,
    variants: [{ id: "6", label: "جعبه ۶ عددی", price: 1500000 }, { id: "12", label: "جعبه ۱۲ عددی", price: 2850000 }],
  },
  {
    id: "caramel", slug: "salted-caramel", name: "کارامل نمکی", latin: "Caramel Salé",
    category: "bonbon", short: "شکلات شیری با کارامل روان و دانه‌های نمک",
    description: "کاراملی کره‌ای و روان در پوسته‌ای از شکلات شیری، با چند دانه نمک دریایی برای تعادلی دلنشین.",
    ingredients: "شکلات شیری، شکر، خامه، کره، نمک دریایی",
    image: caramel, piecePrice: 220000, stock: 50,
    variants: [{ id: "6", label: "جعبه ۶ عددی", price: 1300000 }, { id: "12", label: "جعبه ۱۲ عددی", price: 2450000 }],
  },
  {
    id: "rose", slug: "rose-cardamom", name: "گل محمدی و هل", latin: "Rose & Cardamome",
    category: "truffle", short: "شکلات سفید با گلبرگ محمدی و هل",
    description: "ترافلی از شکلات سفید با گاناش هل، تزئین‌شده با گلبرگ‌های خشک گل محمدی و خردهٔ پسته.",
    ingredients: "شکلات سفید، خامه، هل، گلبرگ گل محمدی، پسته",
    image: rose, piecePrice: 240000, stock: 20,
    variants: [{ id: "6", label: "جعبه ۶ عددی", price: 1450000 }, { id: "12", label: "جعبه ۱۲ عددی", price: 2750000 }],
  },
  {
    id: "cherry", slug: "sour-cherry-heart", name: "قلب آلبالو", latin: "Cœur Griotte",
    category: "bonbon", short: "قلب شکلاتی با مغز آلبالوی ترش",
    description: "قلبی براق از شکلات تلخ با مغزی از گاناش آلبالوی ترش؛ انتخابی عاشقانه برای لحظه‌های خاص.",
    ingredients: "شکلات تلخ، آلبالو، خامه، شکر",
    image: cherry, piecePrice: 250000, stock: 35,
    variants: [{ id: "6", label: "جعبه ۶ عددی", price: 1500000 }, { id: "12", label: "جعبه ۱۲ عددی", price: 2850000 }],
  },
  {
    id: "signature-box", slug: "signature-gift-box", name: "جعبهٔ امضای آناهیتا", latin: "Signature Box",
    category: "giftbox", short: "گزیده‌ای از همهٔ طعم‌های مجموعه در جعبه‌ای نفیس",
    description: "جعبه‌ای شرابی با لبه‌های طلایی، چیده‌شده با منتخبی از بن‌بن‌ها و ترافل‌های آناهیتا. مناسب سالگرد، تولد و هر لحظه‌ای که سزاوار هدیه‌ای ماندگار است.",
    ingredients: "ترکیبی از طعم‌های مجموعه — فهرست کامل داخل جعبه",
    image: giftOpen, piecePrice: null, stock: 15,
    variants: [{ id: "12", label: "۱۲ عددی", price: 3200000 }, { id: "24", label: "۲۴ عددی", price: 6100000 }],
  },
  {
    id: "yalda-box", slug: "seasonal-celebration-box", name: "جعبهٔ جشن فصل", latin: "Celebration Box",
    category: "seasonal", short: "مجموعهٔ ویژهٔ یلدا، نوروز و جشن‌های پایان سال",
    description: "جعبه‌ای قهوه‌ای با روبان طلایی و طعم‌های فصلی که برای جشن‌های یلدا، نوروز و کریسمس آماده می‌شود. موجودی این مجموعه محدود است.",
    ingredients: "طعم‌های فصلی — هر فصل متفاوت",
    image: giftClosed, piecePrice: null, stock: 0,
    variants: [{ id: "16", label: "۱۶ عددی", price: 4400000 }],
  },
];

export const BOX_SIZES = [
  { id: "s4", pieces: 4, label: "جعبه ۴ عددی", base: 350000, cols: 2 },
  { id: "s9", pieces: 9, label: "جعبه ۹ عددی", base: 550000, cols: 3 },
  { id: "s16", pieces: 16, label: "جعبه ۱۶ عددی", base: 850000, cols: 4 },
] as const;

export const SHIPPING = [
  { id: "tehran_express", label: "پیک ویژهٔ تهران", note: "تحویل همان روز یا روز بعد — فقط استان تهران", cost: 180000, tehranOnly: true },
  { id: "tipax", label: "تیپاکس", note: "۲ تا ۴ روز کاری، سراسر کشور", cost: 250000, tehranOnly: false },
  { id: "post_pishtaz", label: "پست پیشتاز", note: "۳ تا ۷ روز کاری، سراسر کشور", cost: 120000, tehranOnly: false },
] as const;

export const MESSAGE_MAX = 150;

export type ProductLine = { kind: "product"; productId: string; variantId: string; qty: number };
export type BoxLine = { kind: "box"; sizeId: string; picks: string[]; message: string; qty: number };
export type CartLineInput = ProductLine | BoxLine;

export class OrderError extends Error {}

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const getProductBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export function availableShipping(province: string) {
  return SHIPPING.filter((s) => !s.tehranOnly || province === TEHRAN);
}

export type PricedLine = { title: string; detail: string; qty: number; unit: number; total: number };

export function priceLine(line: CartLineInput): PricedLine {
  if (!Number.isInteger(line.qty) || line.qty < 1 || line.qty > 20) throw new OrderError("تعداد نامعتبر است");
  if (line.kind === "product") {
    const p = getProduct(line.productId);
    const v = p?.variants.find((x) => x.id === line.variantId);
    if (!p || !v) throw new OrderError("محصول یافت نشد");
    if (p.stock < line.qty) throw new OrderError(`موجودی «${p.name}» کافی نیست`);
    return { title: p.name, detail: v.label, qty: line.qty, unit: v.price, total: v.price * line.qty };
  }
  const size = BOX_SIZES.find((s) => s.id === line.sizeId);
  if (!size) throw new OrderError("اندازهٔ جعبه نامعتبر است");
  if (line.picks.length !== size.pieces) throw new OrderError("جعبه کامل نشده است");
  if (line.message.length > MESSAGE_MAX) throw new OrderError("پیام هدیه بیش از حد طولانی است");
  let unit = size.base;
  for (const id of line.picks) {
    const p = getProduct(id);
    if (!p || p.piecePrice === null || p.stock <= 0) throw new OrderError("یکی از شکلات‌های انتخابی در دسترس نیست");
    unit += p.piecePrice;
  }
  return { title: `جعبهٔ دلخواه — ${size.label}`, detail: line.message ? `پیام: ${line.message}` : "بدون پیام", qty: line.qty, unit, total: unit * line.qty };
}

export function computeOrder(lines: CartLineInput[], shippingId: string, province: string) {
  if (lines.length === 0) throw new OrderError("سبد خرید خالی است");
  const priced = lines.map(priceLine);
  const ship = availableShipping(province).find((s) => s.id === shippingId);
  if (!ship) throw new OrderError("روش ارسال برای این استان در دسترس نیست");
  const subtotal = priced.reduce((a, l) => a + l.total, 0);
  return { lines: priced, subtotal, shipping: ship.cost, shippingLabel: ship.label, total: subtotal + ship.cost };
}

export const fa = (n: number) => n.toLocaleString("fa-IR");
export const toman = (n: number) => `${fa(n)} تومان`;

export const ORDER_STATUS: Record<string, string> = {
  awaiting_payment: "در انتظار پرداخت",
  receipt_submitted: "رسید ارسال شد — در انتظار تأیید",
  paid: "پرداخت تأیید شد",
  preparing: "در حال آماده‌سازی",
  shipped: "ارسال شد",
  delivered: "تحویل داده شد",
  cancelled: "لغو شد",
};
