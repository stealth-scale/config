/**
 * Covers an import written for its side effect rather than for a binding.
 */

import { type Rules } from "#lint/rules/rules.ts";

/**
 * The file types whose import exists to put them into the bundle.
 */
const BUNDLED = ["**/*.css", "**/*.scss", "**/*.less"];

/**
 * Refuses an import nothing reads, except where a stylesheet is the import.
 *
 * @remarks
 *   A stylesheet is handed to the bundler and has no value to bind. Every other
 *   unassigned import is a module somebody stopped using and left at the top of
 *   the file.
 */
export const ASSET: Rules = {
  "no-unassigned-import": ["error", { allow: BUNDLED }],
};
