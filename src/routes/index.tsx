import { createFileRoute } from "@tanstack/react-router";
import { MarketingHome } from "@/components/marketing/MarketingHome";
import { marketplaceQuery } from "@/lib/marketplace";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta({
      title: "NDH eStore — Launch and scale your online commerce",
      description:
        "Storefronts, WhatsApp-first ordering, per-state delivery pricing and multi-currency payments. NDH eStore is Najeeb Digital Hub's commerce platform for African merchants selling globally.",
    }),
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(marketplaceQuery()),
  component: MarketingHome,
});
