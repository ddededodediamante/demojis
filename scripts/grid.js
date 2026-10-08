import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "..");
const assetsDir = path.join(root, "assets");
const distDir = path.join(root, "dist");

const ASPECT = 2;
const TARGET_WIDTH = 1024;
const MIN_CELL = 32;
const MAX_CELL = 256;

const sort = (a, b) => a.localeCompare(b);

async function collect(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries.sort((a, b) => sort(a.name, b.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(full)));
    else if (
      entry.isFile() &&
      path.extname(entry.name).toLowerCase() === ".png"
    )
      files.push(full);
  }

  return files;
}

function pickGrid(count) {
  let best = null;

  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    const diff = Math.abs(cols / rows - ASPECT);
    const wasted = cols * rows - count;
    const candidate = { cols, rows, diff, wasted };

    if (
      !best ||
      candidate.diff < best.diff - 1e-9 ||
      (Math.abs(candidate.diff - best.diff) < 1e-9 &&
        candidate.wasted < best.wasted) ||
      (Math.abs(candidate.diff - best.diff) < 1e-9 &&
        candidate.wasted === best.wasted &&
        candidate.cols > best.cols)
    ) {
      best = candidate;
    }
  }

  return best;
}

async function main() {
  const files = await collect(assetsDir);
  if (files.length === 0)
    throw new Error(`No PNG assets found in ${assetsDir}`);

  const grid = pickGrid(files.length);
  const cell = Math.min(
    MAX_CELL,
    Math.max(MIN_CELL, Math.round(TARGET_WIDTH / grid.cols))
  );
  const emojiSize = Math.max(1, cell - 2);

  const width = grid.cols * cell;
  const height = grid.rows * cell;

  const composite = [];
  let rawTotal = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const input = await sharp(file)
      .resize(emojiSize, emojiSize, { fit: "fill" })
      .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
      .toBuffer();

    rawTotal += (await fs.stat(file)).size;

    composite.push({
      input,
      left: (i % grid.cols) * cell + 1,
      top: Math.floor(i / grid.cols) * cell + 1
    });
  }

  await fs.mkdir(distDir, { recursive: true });
  const outputPath = path.join(distDir, "grid.png");

  const result = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite(composite)
    .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
    .toFile(outputPath);

  console.info(`Emojis: ${files.length}`);
  console.info(
    `Grid: ${grid.cols} x ${grid.rows} cells of ${cell}px (ratio ${(width / height).toFixed(3)})`
  );
  console.info(`Size: ${width}x${height}`);
  console.info(
    `Output: ${path.relative(root, outputPath)} (${(result.size / 1024).toFixed(1)} KB)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
