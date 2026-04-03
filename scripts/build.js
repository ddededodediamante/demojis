import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "..");
const imagesDir = path.join(root, "assets");
const distDir = path.join(root, "dist");
const outputPath = path.join(distDir, "data.json");
const srcDataPath = path.join(root, "src", "data.json");

const sizes = [32, 64, 128, 256];

const result = {
  all: [],
  categories: {},
};

const sort = (a, b) => a.localeCompare(b);

async function ensureEmptyDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  await ensureEmptyDir(distDir);

  const categoryDirs = (await fs.readdir(imagesDir, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort(sort);

  for (const category of categoryDirs) {
    const categoryPath = path.join(imagesDir, category);

    const files = (await fs.readdir(categoryPath, { withFileTypes: true }))
      .filter(f => f.isFile())
      .map(f => path.parse(f.name).name)
      .sort(sort);

    result.categories[category] = files;
    result.all.push(...files);

    for (const fileBase of files) {
      const inputPath = path.join(categoryPath, `${fileBase}.png`);

      for (const size of sizes) {
        const outDir = path.join(distDir, "images", String(size));
        await fs.mkdir(outDir, { recursive: true });

        const outPath = path.join(outDir, `${fileBase}.png`);

        await sharp(inputPath)
          .resize(size, size, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .png({
            compressionLevel: 9,
            adaptiveFiltering: true,
          })
          .toFile(outPath);
      }
    }
  }

  result.all.sort(sort);

  console.info(`Total emojis: ${result.all.length}`);
  console.info(
    `Categories: ${Object.keys(result.categories).join(", ")} (${Object.keys(result.categories).length})`,
  );

  const stringified = JSON.stringify(result);
  await fs.writeFile(outputPath, stringified, "utf8");
  await fs.writeFile(srcDataPath, stringified, "utf8");

  console.info("Build completed successfully.");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
