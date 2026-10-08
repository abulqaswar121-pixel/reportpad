/** Shared builder for per-page head metadata. */
export type PageMetaInput = {
  title: string;
  description: string;
  type?: "website" | "article" | "product";
  image?: string;
};

export function pageMeta({
  title,
  description,
  type = "website",
  image = "/og-image.png",
}: PageMetaInput) {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:site_name", content: "NDH eStore" },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}
