import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "..");
const unicodeMdPath = path.join(root, "UNICODE.md");
const srcOutputPath = path.join(root, "src", "unicode.json");
const distOutputPath = path.join(root, "dist", "unicode.json");

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/;
const SEPARATOR_PATTERN = /^:?-{3,}:?$/;

const sort = (a, b) => a.localeCompare(b);

function splitRow(line) {
  return line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function parseUnicodeTable(markdown) {
  const mappings = {};

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line.startsWith("|")) continue;

    const cells = splitRow(line);
    if (cells.every((cell) => SEPARATOR_PATTERN.test(cell))) continue;
    if (cells.length < 2) continue;

    const [unicode, demojiCell] = cells;
    const match = demojiCell.match(LINK_PATTERN);
    if (!match || !unicode) continue;

    const name = match[1].trim();
    if (!name) continue;

    if (mappings[name] && mappings[name] !== unicode) {
      console.warn(
        `Warning: "${name}" has multiple Unicode values; keeping the last one.`
      );
    }

    mappings[name] = unicode;
  }

  return Object.fromEntries(
    Object.entries(mappings).sort(([a], [b]) => sort(a, b))
  );
}

async function main() {
  const markdown = await fs.readFile(unicodeMdPath, "utf8");
  const mappings = parseUnicodeTable(markdown);
  const count = Object.keys(mappings).length;

  if (count === 0) {
    throw new Error(`No Unicode mappings found in ${unicodeMdPath}`);
  }

  const stringified = `${JSON.stringify(mappings, null, 2)}\n`;

  await fs.mkdir(path.dirname(srcOutputPath), { recursive: true });
  await fs.writeFile(srcOutputPath, stringified, "utf8");

  await fs.mkdir(path.dirname(distOutputPath), { recursive: true });
  await fs.writeFile(distOutputPath, stringified, "utf8");

  console.info(`Converted ${count} Unicode mappings from UNICODE.md.`);
  console.info(`Output: ${path.relative(root, srcOutputPath)}`);
  console.info(`Output: ${path.relative(root, distOutputPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
