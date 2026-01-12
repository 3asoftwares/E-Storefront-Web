import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Downgrade unescaped entities to warnings (common in JSX)
      "react/no-unescaped-entities": "warn",
      // Downgrade img element warning (some cases are intentional)
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;
