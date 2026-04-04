import { defineConfig } from "tsup";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { version } = require("./package.json");

export default defineConfig({
  entry: ["src/index.js", "src/browser.js"],
  format: ["esm", "cjs"],
  shims: true,
  minify: true,
  define: {
    __VERSION__: JSON.stringify(version),
  },
});
