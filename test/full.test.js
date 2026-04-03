import { test } from "node:test";
import assert from "node:assert";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM
import * as esm from "../dist/index.js";

// CJS 
const cjs = await import("../dist/index.cjs");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, "../dist");
const IMAGE_DIR = path.join(DIST_DIR, "images");

const SIZES = [32, 64, 128, 256];

test("exports exist (ESM)", () => {
  assert.ok(esm.getAll);
  assert.ok(esm.getCategories);
  assert.ok(esm.getByCategory);
  assert.ok(esm.getRandom);
  assert.ok(esm.getImage);
});

test("exports exist (CJS)", () => {
  assert.ok(cjs.getAll);
  assert.ok(cjs.getCategories);
  assert.ok(cjs.getByCategory);
  assert.ok(cjs.getRandom);
  assert.ok(cjs.getImage);
});

test("getAll returns valid data", () => {
  const all = esm.getAll();
  assert(Array.isArray(all));
  assert(all.length > 0);
});

test("categories are valid", () => {
  const categories = esm.getCategories();
  assert(Array.isArray(categories));
  assert(categories.length > 0);

  for (const cat of categories) {
    const list = esm.getByCategory(cat);
    assert(Array.isArray(list));
    assert(list.length > 0);
  }
});

test("all emojis exist in categories", () => {
  const all = esm.getAll();
  const categories = esm.getCategories();

  const collected = new Set();

  for (const cat of categories) {
    for (const e of esm.getByCategory(cat)) {
      collected.add(e);
    }
  }

  for (const e of all) {
    assert(collected.has(e));
  }
});

test("getRandom returns valid emoji", () => {
  const all = esm.getAll();

  for (let i = 0; i < 20; i++) {
    const e = esm.getRandom();
    assert(all.includes(e));
  }
});

test("getRandom(category) works", () => {
  const categories = esm.getCategories();

  for (const cat of categories) {
    const list = esm.getByCategory(cat);
    const e = esm.getRandom(cat);
    assert(list.includes(e));
  }
});

test("getImage returns valid file URLs", () => {
  const all = esm.getAll().slice(0, 10); 

  for (const name of all) {
    const url = esm.getImage(name, 256);
    assert(url.startsWith("file://"));
  }
});

test("image files exist for all sizes", () => {
  const all = esm.getAll().slice(0, 20); 

  for (const name of all) {
    for (const size of SIZES) {
      const filePath = path.join(
        IMAGE_DIR,
        String(size),
        `${name}.png`
      );

      assert.ok(fs.existsSync(filePath), `Missing: ${filePath}`);
    }
  }
});

test("invalid category returns empty array", () => {
  const result = esm.getByCategory("nonexistent");
  assert.deepStrictEqual(result, []);
});

test("getRandom invalid category returns null", () => {
  const result = esm.getRandom("nonexistent");
  assert.strictEqual(result, null);
});
