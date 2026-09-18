# NDH E-store launch readiness

## Confirmed built
- Marketing site with home, features, pricing, about, resources, contact, legal, sign-in, sign-up, password reset, and call-booking pages.
- Vendor onboarding with store name, unique shop address, business category, WhatsApp contact, description, and storefront design settings.
- Vendor dashboard with overview, products, orders, design settings, marketing/Meta tools, logistics, billing, ledger, and payout areas.
- Public vendor storefronts with product pages, variants, cart, delivery zones, digital/service/booking product types, WhatsApp checkout, and payment checkout paths.
- Nigerian payment path through Paystack and international payment path through Flutterwave, including signed webhooks and return verification.
- Vendor stock/product management, order fulfilment states, delivery zones, cargo profiles, payout accounts, payout requests, and payment/email event records.
- Transactional email templates and a protected email-dispatch endpoint.
- Meta catalogue feed, Pixel/Conversions API settings, server-side commerce event hooks, and customer-care UI.
- Lovable Cloud backend is responding normally, and the repository includes the E-store migrations and generated integrations.

## Launch blockers and connections
1. Apply or reconcile the E-store database migrations in Lovable Cloud. The live database currently exposes the former school-report tables, while the app queries E-store tables such as `vendors`, `products`, `orders`, and `payouts`.
2. Configure and verify the production payment credentials and callback/webhook URLs for Paystack; add and verify Flutterwave credentials if international checkout is required.
3. Configure Resend API access, the sender address/domain, and the protected email-dispatch schedule. The code is ready, but the required email variables were not found in the current secret inventory.
4. Configure production app URL values so password reset, payment returns, catalogue feeds, and public links use the live NDH domain rather than local fallbacks.
5. Decide whether Stripe is part of launch. The current application code uses Paystack and Flutterwave checkout; the existing Stripe test secret is not enough to claim a live Stripe flow.
6. Configure Meta Pixel/CAPI per vendor after launch; the dashboard connection is built, but each merchant supplies their own IDs and access token.
7. Add PWA/offline support only if it remains a launch requirement. No service-worker or install manifest wiring is currently present.
8. Add route-specific SEO metadata and social tags for the public pages before launch; currently only the shared root metadata is defined.
9. Run authenticated smoke tests after the database is reconciled: sign up, onboard a vendor, create a product, publish a store, place a test order, verify payment, process the order, send email, and request a payout.

## Technical details
- Preserve TanStack Start file-based routing under `src/routes/`.
- Keep generated route and Supabase integration files managed by the platform.
- Do not bring back the former school-report routes, tables, or feature assumptions.
- Keep the existing `build:dev` script fix.
