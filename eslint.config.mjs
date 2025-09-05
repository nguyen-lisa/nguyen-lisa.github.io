// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import jsxA11y from "eslint-plugin-jsx-a11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type {import("eslint").Linter.FlatConfig[]} */
const config = [
  // Next.js recommended + TS
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Ignore build artifacts
  { ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"] },

  // Accessibility rules
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "jsx-a11y": jsxA11y },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      "jsx-a11y/anchor-is-valid": "off",
      // Optional: if needed during refactors
      // "jsx-a11y/no-static-element-interactions": "warn",
      // "jsx-a11y/click-events-have-key-events": "warn",
    },
  },
];

export default config;
