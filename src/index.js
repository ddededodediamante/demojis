import path from "path";
import { pathToFileURL, fileURLToPath } from "url";
import data from "./data.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  getImage,
  isWebVersion
};
