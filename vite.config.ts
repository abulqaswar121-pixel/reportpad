// Lovable's TanStack config already wires TanStack Start, React, Tailwind, the "@" path alias,
// and the production server build. Do not add those plugins here again.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  server: {
    // Preview sandboxes serve the app through a proxied host, so allow it explicitly.
    allowedHosts: true,
  },
});
