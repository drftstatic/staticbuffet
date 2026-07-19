import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Note: When deploying to platforms outside of Replit (e.g. Vercel),
// the Replit-specific plugins can cause build errors because the
// packages may not be available. Comment out these imports to keep
// the configuration portable.
// import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    // The following plugins are specific to the Replit development environment.
    // They are commented out to prevent errors when running on other platforms.
    // runtimeErrorOverlay(),
    // ...(process.env.NODE_ENV !== "production" &&
    // process.env.REPL_ID !== undefined
    //   ? [
    //       await import("@replit/vite-plugin-cartographer").then((m) =>
    //         m.cartographer(),
    //       ),
    //     ]
    //   : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    // Build to a top-level `dist` directory for compatibility with platforms like Vercel.
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    // Bundle optimization
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/react/") || id.includes("/node_modules/react-dom/") || id.includes("/node_modules/scheduler/")) {
            return "vendor";
          }
          if (id.includes("/node_modules/@radix-ui/")) {
            return "ui";
          }
          if (id.includes("/node_modules/clsx/") || id.includes("/node_modules/tailwind-merge/") || id.includes("/node_modules/date-fns/")) {
            return "utils";
          }
        }
      }
    },
    // Performance optimizations
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
