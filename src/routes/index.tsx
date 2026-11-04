import { createFileRoute } from "@tanstack/react-router";
import { MarketingHome } from "@/components/marketing/MarketingHome";
import { marketplaceQuery } from "@/lib/marketplace";
import { pageMeta } from "@/lib/seo";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta({
      title: brand.seoTitle,
      description: brand.seoDescription,
    }),
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(marketplaceQuery()),
  component: MarketingHome,
});
