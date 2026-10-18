import { availableShipping } from "./catalog";
import { isValidMobile, isValidPostal, PROVINCES } from "./iran";

export type CheckoutFields = {
  customerName: string; mobile: string; province: string; city: string;
  address: string; postalCode: string; giftNote: string; shippingId: string;
};

export function validateCheckout(fields: CheckoutFields): Record<string, string> {
  const errors: Record<string, string> = {};
  if (fields.customerName.trim().length < 2 || fields.customerName.trim().length > 80) errors["customerName"] = "نام و نام خانوادگی را وارد کنید (۲ تا ۸۰ نویسه)";
  if (!isValidMobile(fields.mobile)) errors["mobile"] = "شمارهٔ موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد";
  if (!PROVINCES[fields.province]) errors["province"] = "استان را انتخاب کنید";
  if (!PROVINCES[fields.province]?.includes(fields.city)) errors["city"] = "شهر را انتخاب کنید";
  if (fields.address.trim().length < 10 || fields.address.trim().length > 400) errors["address"] = "نشانی کامل را وارد کنید (۱۰ تا ۴۰۰ نویسه)";
  if (!isValidPostal(fields.postalCode)) errors["postalCode"] = "کد پستی باید ۱۰ رقم باشد";
  if (!availableShipping(fields.province).some((ship) => ship.id === fields.shippingId)) errors["shippingId"] = "روش ارسال را انتخاب کنید";
  if (fields.giftNote.length > 300) errors["giftNote"] = "یادداشت هدیه باید حداکثر ۳۰۰ نویسه باشد";
  return errors;
}