import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import styles from "../styles.css?url";
import { AICustomerCare } from "@/components/AICustomerCare";
import { brand } from "@/lib/brand";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: brand.seoTitle },
      { name: "description", content: brand.seoDescription },
      { name: "theme-color", content: "#070f1e" },
      { name: "author", content: brand.parent.label },
      { property: "og:site_name", content: brand.name },
      { property: "og:title", content: brand.seoTitle },
      { property: "og:description", content: brand.seoDescription },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: styles },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // The invisible translation engine loads from Google in the background.
      { rel: "preconnect", href: "https://translate.google.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://translate.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  component: Root,
});

function Root() {
  const { queryClient } = Route.useRouteContext();
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Outlet />
          <AICustomerCare />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
