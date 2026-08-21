import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["docs/**", "node_modules/**", ".claude/**"] },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser
      }
    },
    rules: {
      "no-var": "error",
      eqeqeq: "error"
    }
  },
  {
    files: ["*.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node
      }
    },
    rules: {
      "no-var": "error",
      eqeqeq: "error"
    }
  }
];
