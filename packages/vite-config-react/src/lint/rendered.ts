/**
 * Excuses the files a specification draws its markup in from the docblock rules.
 */

import { type Contribution, lint, named } from "@stealthscale/vite-config";

/**
 * The two spellings a rendering specification and its fixtures are written in.
 */
export const RENDERED = ["**/*.spec.tsx", "**/*.fixtures.tsx"];

/**
 * Stops the linter asking a rendering specification for doc comments.
 *
 * @remarks
 *   A workspace root resolves the node tier, which excuses `.spec.ts` and `.fixtures.ts` and knows
 *   nothing of the `.tsx` spellings. A component written to be driven by one test carries that
 *   test's name as its whole explanation, and this covers it at the root as well.
 */
export function rendered(): Contribution {
  return named("react.lint.rendered", lint.undocumented(RENDERED));
}
