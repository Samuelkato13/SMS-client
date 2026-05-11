const path = require("path");
const tailwindcss = require("tailwindcss");
const fs = require("fs");

/** `.cjs` so Node treats this as CommonJS when package.json has `"type": "module"`. */
function resolveTailwindConfig() {
  const localCjs = path.resolve(__dirname, "tailwind.config.cjs");
  const localJs = path.resolve(__dirname, "tailwind.config.js");
  const localTs = path.resolve(__dirname, "tailwind.config.ts");
  const rootTs = path.resolve(__dirname, "..", "tailwind.config.ts");
  if (fs.existsSync(localCjs)) return localCjs;
  if (fs.existsSync(localJs)) return localJs;
  if (fs.existsSync(localTs)) return localTs;
  if (fs.existsSync(rootTs)) return rootTs;
  return localCjs;
}

module.exports = {
  plugins: [
    tailwindcss({ config: resolveTailwindConfig() }),
    require("autoprefixer"),
  ],
};
