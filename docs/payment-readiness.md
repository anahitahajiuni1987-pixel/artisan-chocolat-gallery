# ANAHITA Iranian payment readiness

## Existing setup
The app already uses Lovable Cloud to persist guest orders and receipt uploads. Keep that setup; no new backend, database or payment schema is required in this phase. The catalog prices and stock remain owner-unconfirmed samples. Card-to-card receipt submission is not proof of payment. No bank card details, SMS service, or ZarinPal merchant credential has been supplied.

## Not connected
ZarinPal is disabled in checkout. `src/lib/payments.server.ts` defines a server-only gateway adapter contract and fails closed. It deliberately implements no external requests, callback, or payment verification. There are no payment secrets in browser code. This is preparation, not a functioning integration.

## Next integration phase
1. Obtain the owner's real merchant ID through managed secrets, never a frontend variable or committed file. Confirm official gateway API version, amount unit and merchant eligibility before coding.
2. Add durable payment-attempt records with order ID, authority, expected amount/currency and verification outcome through an additive migration. Keep existing orders and receipt records.
3. Initiate checkout through a server function. Read the stored order and recompute trusted prices server-side, reject non-payable orders, and use an allowlisted HTTPS callback origin. Convert toman only at the provider boundary according to the actual API currency/unit; never infer currency from an untrusted request.
4. Use a public server callback under `/api/public/payments/` that treats callback parameters as untrusted. Look up the persisted authority and expected amount, then call the gateway verification API server-to-server with the private merchant credential. A browser redirect, `Status=OK`, or uploaded receipt must never mark an order paid.
5. Verify authority, amount and order association; update payment state idempotently in a database transaction. Replayed callbacks must not cause duplicate fulfillment. Cancelled, failed, mismatched and interrupted attempts remain unpaid and may be retried safely.
6. Before enabling the payment option, test successful, cancelled, failed, replayed, mismatched and timed-out verification in the provider's test environment. Then verify a permitted live transaction and read back its status through the order UI. Configure the production HTTPS callback and publish the verified integration.

## Launch blockers
- Real product prices and inventory.
- Real bank recipient/card details before accepting transfers.
- Gateway credential and approved callback URL before enabling ZarinPal.
- Secure owner receipt-review and fulfillment interface; not part of this phase.
- Public guest-order lookup and receipt upload should receive abuse/rate limiting before a production launch.