import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022
    },
    rules: {
      "@typescript-eslint/no-misused-promises": "off"
    }
  },
  {
    ignores: ["dist/**"]
  }
];
