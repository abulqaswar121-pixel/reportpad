# NDH E-store go-live order

## Goal
Take the current NDH E-store from its existing codebase to a tested public launch, then connect the user’s custom domain last.

## Verified starting point
- The NDH E-store pages, vendor dashboard, storefront, product management, order management, shipping, payouts, payment return flows, webhooks, email queue, and Meta tools are present in the repository.
- TanStack Start file-based routing is already in place under `src/routes/`.
- Lovable Cloud is responding normally.
- The live database currently contains the former school-report tables, while this app requires the NDH commerce schema (`vendors`, `products`, `orders`, `payouts`, payment events, and related functions).
- The build now includes the required `build:dev` script.
- Offline/PWA wiring and route-specific SEO metadata are not currently present.

## Order of work
1. **Make the commerce database match the app**
   - Apply the existing NDH migrations through the database migration workflow.
   - Confirm tables, functions, grants, RLS, storage buckets, and payment/email event tables.
   - Resolve or document security-linter findings that affect launch.

2. **Connect production services**
   - Set the production app URL used by auth links, payment callbacks, feeds, and emails.
   - Verify Paystack credentials and webhook delivery for Nigerian payments.
   - Add Flutterwave credentials and webhook settings if international checkout is part of the first launch.
   - Configure Resend and the sender domain for transactional email delivery.
   - Keep Stripe out of the first launch unless a live Stripe checkout is explicitly required; the current code does not establish a complete Stripe flow.

3. **Run a real end-to-end test**
   - Create a test vendor account.
   - Complete onboarding and create a store.
   - Add products and delivery zones.
   - Open the public storefront and place a test order.
   - Verify the payment return and webhook, then move the order through fulfilment.
   - Confirm customer/vendor emails, stock changes, and payout-account validation.

4. **Close launch polish items**
   - Add route-specific page titles and descriptions for public pages.
   - Decide whether offline/PWA support is required for launch; if yes, add the install manifest and service worker before publishing.
   - Confirm legal copy, support contacts, pricing, and the final NDH brand wording.

5. **Publish the stable app**
   - Run the final security check.
   - Publish the tested build to the Lovable URL.
   - Re-test sign-in, onboarding, storefront, checkout, payment callback, and webhooks on the published URL.

6. **Connect the custom domain last**
   - Add the root domain and `www` domain in Project Settings → Domains.
   - Complete the DNS verification Lovable provides.
   - Wait for SSL and DNS verification, then set the preferred domain as primary.
   - Re-test auth redirects, payment callbacks, email links, catalogue feeds, and storefront links on the custom domain.

## Technical boundaries
- Use the existing TanStack Start route architecture; do not introduce another router.
- Use the database migration workflow for all schema changes.
- Keep service credentials in secure project secrets, never in committed files or chat.
- Do not restore the former school-report routes or schema as part of this launch.
