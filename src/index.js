import path from "path";
import { pathToFileURL, fileURLToPath } from "url";
import data from "./data.json";
import unicodeByName from "./unicode.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VARIATION_SELECTOR = /[\uFE0E\uFE0F]/g;

function normalizeUnicode(value) {
  return value.replace(VARIATION_SELECTOR, "");
}

const nameByUnicode = Object.fromEntries(
  Object.entries(unicodeByName).map(([name, unicode]) => [
    normalizeUnicode(unicode),
    name
  ])
);

export const all = data.all;
export const categories = data.categories;

export function getAll() {
  return all;
}

export function getCategories() {
  return Object.keys(categories);
}

export function getByCategory(name) {
  return categories[name] ?? [];
}

export function getRandom(category) {
  const list = category ? categories[category] : all;
  if (!list || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}

export function getUnicode(name) {
  return unicodeByName[name] ?? null;
}

export function getDemoji(unicode) {
  if (typeof unicode !== "string") return null;
  return nameByUnicode[normalizeUnicode(unicode)] ?? null;
}

export function getImage(name, size = 256) {
  const fileName = `${name}.png`;

  return pathToFileURL(
    path.resolve(__dirname, "images", String(size), fileName)
  ).href;
}

/** Boolean that says if the Demojis package is using the web version. */
export const isWebVersion = false;

export default {
  all,
  categories,
  getAll,
  getCategories,
  getByCategory,
  getRandom,
  getUnicode,
  getDemoji,
  getImage,
  isWebVersion
};
