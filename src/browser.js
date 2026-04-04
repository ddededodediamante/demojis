import data from "./data.json";

export const all = data.all;
export const categories = data.categories;

let _baseUrl = `https://cdn.jsdelivr.net/npm/demojis@${__VERSION__}/dist/images`;

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

export function setBaseUrl(url) {
  _baseUrl = url.replace(/\/$/, "");
}

export function getImage(name, size = 256) {
  return `${_baseUrl}/${size}/${name}.png`;
}

export default { all, categories, getAll, getCategories, getByCategory, getRandom, getImage, setBaseUrl };