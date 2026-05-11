const path = require("path");
const tailwindcss = require("tailwindcss");
const fs = require("fs");

/** Client-local config (works on Vercel when repo root = `client/`). Monorepo fallback. */
function resolveTailwindConfig() {
  const localJs = path.resolve(__dirname, "tailwind.config.js");
  const localTs = path.resolve(__dirname, "tailwind.config.ts");
  const rootTs = path.resolve(__dirname, "..", "tailwind.config.ts");
  if (fs.existsSync(localJs)) return localJs;
  if (fs.existsSync(localTs)) return localTs;
  if (fs.existsSync(rootTs)) return rootTs;
  return localJs;
}

module.exports = {
  plugins: [
    tailwindcss({ config: resolveTailwindConfig() }),
    require("autoprefixer"),
  ],
};
