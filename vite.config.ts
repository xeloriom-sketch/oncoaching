import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: (() => { const p = process.env.VITE_BASE_PATH ?? ""; return p ? p + "/" : "/"; })(),
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: "esbuild",
    cssCodeSplit: false,
    reportCompressedSize: false,
    modulePreload: { polyfill: false },
    assetsInlineLimit: 4096,
    sourcemap: false,
    rollupOptions: {
      output: {
        compact: true,
        manualChunks: {
          "vendor-react":      ["react", "react-dom", "react-router-dom"],
          "vendor-motion":     ["framer-motion"],
          "vendor-query":      ["@tanstack/react-query"],
          "vendor-icons":      ["lucide-react"],
          "vendor-scroll":     ["lenis"],
          "vendor-datepicker": ["react-day-picker", "date-fns"],
        },
      },
    },
  },
}));
