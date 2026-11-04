/**
 * Subscription plan catalogue for NDH ShopOS.
 * The tiers map 1:1 to `SubscriptionTier` in `@/types/schema`
 * (starter | pro | global_enterprise, surfaced to merchants as Enterprise).
 */
export type Plan = {
  /** Merchant-facing tier label. */
  name: string;
  /** Value stored in `vendors.subscription_tier`. */
  tier: "starter" | "pro" | "global_enterprise";
  monthly: string;
  annual: string;
  /** Transaction fee copy. */
  fee: string;
  desc: string;
  limits: string[];
  cta: string;
  /** Route the CTA should send a merchant to. */
  ctaTo: "/signup" | "/book-call";
  popular?: boolean;
};

export const plans: Plan[] = [
  {
    name: "Starter",
    tier: "starter",
    monthly: "₦5,000",
    annual: "₦48,000",
    fee: "2.5% transaction fee",
    desc: "For new merchants launching their first branded store.",
    limits: [
      "Up to 30 products",
      "1 flat delivery fee per state",
      "Naira checkout + WhatsApp orders",
      "Standard support",
    ],
    cta: "Start Your Free Trial",
    ctaTo: "/signup",
  },
  {
    name: "Pro",
    tier: "pro",
    monthly: "₦15,000",
    annual: "₦144,000",
    fee: "1.5% transaction fee",
    desc: "For growing brands that sell every day.",
    limits: [
      "Unlimited products",
      "Digital downloads & booking calendars",
      "Regional delivery sub-zones",
      "Inventory alerts & priority support",
    ],
    cta: "Start Your Free Trial",
    ctaTo: "/signup",
    popular: true,
  },
  {
    name: "Enterprise",
    tier: "global_enterprise",
    monthly: "₦40,000",
    annual: "₦384,000",
    fee: "1.0% local · 3.5% international",
    desc: "For multi-currency brands selling across borders.",
    limits: [
      "USD, GBP and NGN pricing",
      "Custom domain eligibility",
      "Heavy cargo profiles",
      "Meta feeds & premium support",
    ],
    cta: "Talk to sales",
    ctaTo: "/book-call",
  },
];

/** Side-by-side limits shown on the /pricing comparison strip. */
export const planComparison = [
  ["Products", "Up to 30", "Unlimited", "Unlimited"],
  ["Transaction fee", "2.5%", "1.5%", "1.0% local · 3.5% intl."],
  ["Currencies", "NGN", "NGN", "NGN · USD · GBP"],
  ["Delivery zones", "1 per state", "Regional sub-zones", "Regional + cargo"],
  ["Digital downloads", "—", "Included", "Included"],
  ["Service bookings", "—", "Included", "Included"],
  ["Custom domain", "—", "—", "Eligible"],
  ["Support", "Standard", "Priority", "Premium"],
] as const;
