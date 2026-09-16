/**
 * Declares the React rules every source file in a repository that renders is held to.
 */

import { type Contribution, lint, named } from "@stealthscale/vite-config";

/**
 * The files the rules apply to, which is every source file rather than only the ones with markup.
 */
const FILES = ["**/*.{ts,tsx}"];

/**
 * Each React rule and the severity it is set at.
 */
const RULES = {
  "react/function-component-definition": "error",
  "react/jsx-filename-extension": ["error", { extensions: [".jsx", ".tsx"] }],
  "react/no-danger": "error",
  "react/no-multi-comp": "error",
  "react/only-export-components": "error",
  "react/prefer-function-component": "error",
};

/**
 * Enforces one function component per file, written so the transform recognises it.
 *
 * @remarks
 *   Fast refresh replaces a module wholesale, so it can only keep state where the module exports
 *   nothing but components. The one-component and export rules are what make that hold, and a
 *   package turning either off loses its state on every edit instead of failing the lint run.
 */
export function rules(): Contribution {
  return named(
    "react.lint.rules",
    lint.enforce({
      because: "it renders, so a rule about rendering applies to it",
      files: FILES,
      rules: RULES,
    }),
  );
}
