import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,png,svg,jpg,jpeg,woff,woff2,ttf,otf}",
        ],
      },
      manifest: {
        name: "HostelHub",
        short_name: "HostelHub",
        description: "Tecno hostel management system",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setup.ts",
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@constant": path.resolve(__dirname, "./src/constant"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@layout": path.resolve(__dirname, "./src/layout"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@style": path.resolve(__dirname, "./src/style"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@themes": path.resolve(__dirname, "/src/themes"),
      "@types": path.resolve(__dirname, "/src/ts/types"),
      "@test": path.resolve(__dirname, "./src/__test__"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@ts": path.resolve(__dirname, "./src/ts"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
});
