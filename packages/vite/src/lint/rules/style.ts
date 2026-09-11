/**
 * The spelling picked where the language allows two.
 */

import { type Rules } from "#lint/rules/rules.ts";

/**
 * Which of two spellings this house writes.
 *
 * Each settles a choice that would otherwise be made per file and argued in review. A property
 * signature is checked contravariantly where a method signature is checked both ways, so the
 * stricter spelling is the one worth having.
 */
export const STYLE: Rules = {
  // `T[]` where the element is one word and `Array<T>` where it is not, which is the spelling that
  // stays readable as the element type grows.
  "typescript/array-type": ["error", { default: "array-simple" }],

  "catch-error-name": "error",
  "consistent-type-specifier-style": ["error", "prefer-inline"],
  "explicit-function-return-type": "error",
  "method-signature-style": "error",
  "no-default-export": "error",
  "no-inferrable-types": "error",
  "no-relative-parent-imports": "error",
  "prefer-string-raw": "error",

  // An interface where a shape is named, and a namespace never: modules replaced it, and the two
  // ways of grouping names do not compose.
  "typescript/consistent-type-definitions": ["error", "interface"],
  "typescript/no-namespace": "error",

  // `var` is function-scoped and hoisted, which is a third scoping rule nobody needs.
  "no-var": "error",
};
