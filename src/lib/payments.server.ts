/** Server-only contract for a future gateway adapter. No gateway is connected. */
export type PaymentRequest = {
  orderId: string;
  amountToman: number;
  callbackUrl: string;
};

export type PaymentVerification =
  | { verified: true; reference: string; amountToman: number }
  | { verified: false; reason: "cancelled" | "mismatch" | "failed" };

export interface IranianPaymentGateway {
  request(input: PaymentRequest): Promise<{ authority: string; redirectUrl: string }>;
  verify(input: { authority: string; expectedAmountToman: number }): Promise<PaymentVerification>;
}

/** Fail closed until a real adapter, private credential and verification tests exist. */
export function getPaymentGateway(): IranianPaymentGateway {
  throw new Error("درگاه پرداخت هنوز فعال نشده است");
}