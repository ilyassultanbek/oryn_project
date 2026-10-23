import sharp from "sharp";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

const images = [
  { file: "src/assets/images/baner.webp", lossless: false },
  { file: "src/assets/pages/baner.webp", lossless: false },
  { file: "src/assets/images/login-bg.webp", lossless: false },
  { file: "src/assets/images/logo.webp", lossless: true },
  { file: "src/assets/images/logoDark.webp", lossless: true },
];

async function main() {
  const results = [];

  for (const { file, lossless } of images) {
    const input = path.join(projectRoot, file);
    const output = input.replace(/\.png$/i, ".webp");

    const original = await stat(input);

    const converted = await sharp(input)
      .rotate()
      .webp(
        lossless
          ? { lossless: true, effort: 6 }
          : { quality: 85, effort: 6 }
      )
      .toFile(output);

    results.push({
      file: file.replace(/\.png$/i, ".webp"),
      "PNG (KB)": (original.size / 1024).toFixed(1),
      "WebP (KB)": (converted.size / 1024).toFixed(1),
      "Азайған көлем": (
        (1 - converted.size / original.size) * 100
      ).toFixed(1) + "%",
    });
  }

  console.table(results);
  console.log("Дайын. PNG түпнұсқалары сақталды.");
}

main().catch((error) => {
  console.error("Түрлендіру қатесі:", error.message);
  process.exitCode = 1;
});

