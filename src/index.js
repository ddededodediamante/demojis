import path from "path";
import { pathToFileURL } from "url";
import data from "./data.json";

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

  if (typeof __dirname !== "undefined") {
    return pathToFileURL(
      path.resolve(__dirname, "images", String(size), fileName)
    ).href;
  }

  return new URL(`images/${size}/${fileName}`, import.meta.url).href;
}

export default {
  all,
  categories,
  getAll,
  getCategories,
  getByCategory,
  getRandom,
  getImage,
};
