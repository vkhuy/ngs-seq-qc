import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        find: "@/lib",
        replacement: path.resolve(__dirname, "./src/lib"),
      },
      {
        find: "@/components",
        replacement: path.resolve(__dirname, "./src/components"),
      },
      {
        find: "@/hooks",
        replacement: path.resolve(__dirname, "./src/hooks"),
      },
    ],
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
          ],
          charts: ["recharts"],
        },
      },
    },
  },
}));
