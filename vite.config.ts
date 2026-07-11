// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    server: {
      proxy: {
        // Proxy Lovable CDN asset requests to the public CDN when running on plain localhost.
        // On Lovable preview/published domains this path is served natively and the proxy is unused.
        "/__l5e": {
          target: "https://id-preview--1904647c-6086-4042-bd42-110a0ab53e9b.lovable.app",
          changeOrigin: true,
          secure: true,
        },
      },
    },
  },
});
