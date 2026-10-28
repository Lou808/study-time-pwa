import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages では https://ユーザー名.github.io/リポジトリ名/ に置かれるため、
// GitHub Actions から BASE_PATH="/リポジトリ名/" を渡す。ローカルでは "/"。
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "勉強時間計算",
        short_name: "勉強時間",
        description: "余暇時間を法学と仕事の勉強に配分する",
        lang: "ja",
        start_url: base,
        scope: base,
        display: "standalone",
        background_color: "#f2f4f7",
        theme_color: "#1e3a5f",
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // ビルドした全ファイルを事前キャッシュしてオフラインでも動かす
        globPatterns: ["**/*.{js,css,html,svg,png}"],
      },
    }),
  ],
});
