/**
 * What a file that renders answers to beyond what every file does.
 */

import { type Contribution, lint, named } from "@stealthscale/vite-config";

/**
 * The files these reach, which is everything a package that renders compiles.
 */
const FILES = ["**/*.{ts,tsx}"];

/**
 * The rules the linter files under neither correctness nor pedantry, asked for anyway.
 *
 * Each is a house decision rather than a bug the linter found. Markup assigned as a string is the
 * same hole in React that `innerHTML` is anywhere else, so it is refused in the same terms. A file
 * exporting a component beside something else cannot be refreshed in place, which is a cost paid
 * every save. A class component is a way of writing React that nothing here uses. JSX belongs in a
 * file whose name says it holds JSX, which for TypeScript means `.tsx` and has to be said: the rule
 * ships knowing only about `.jsx`, so left alone it refuses every file in the repository. And one
 * component to a file is what the folder layout already assumes.
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
 * Holds what renders to the rules that only make sense there.
 *
 * @returns The contribution.
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
