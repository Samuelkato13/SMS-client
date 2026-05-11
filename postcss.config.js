const path = require("path");
const tailwindcss = require("tailwindcss");

/** Use the repo-root Tailwind config (shadcn tokens, --radius, animate). A duplicate
 * `client/tailwind.config.js` was shadowing this and stripped most utilities + theme. */
module.exports = {
  plugins: [
    tailwindcss({
      config: path.resolve(__dirname, "..", "tailwind.config.ts"),
    }),
    require("autoprefixer"),
  ],
};
