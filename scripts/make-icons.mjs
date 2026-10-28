// public/icon.svg から PWA 用の PNG アイコンを作る（npm run icons）
import sharp from "sharp";

const sizes = [
  ["public/apple-touch-icon.png", 180],
  ["public/pwa-192.png", 192],
  ["public/pwa-512.png", 512],
];

for (const [file, size] of sizes) {
  await sharp("public/icon.svg").resize(size, size).png().toFile(file);
  console.log(`作成: ${file}`);
}
