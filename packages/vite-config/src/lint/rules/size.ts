/**
 * Caps how far a file, a function and a signature may grow.
 */

import { type Rules } from "#lint/rules/rules.ts";

/**
 * Limits the length, the nesting, the branching and the parameter count.
 *
 * @remarks
 *   Neither blank lines nor comments count towards a limit, so a doc comment
 *   never pushes a file over. A function is capped at a fifth of what a file
 *   is, which leaves room for several of them in a file already at its cap.
 */
export const SIZE: Rules = {
  complexity: ["error", 10],
  "max-depth": ["error", 4],
  "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
  "max-lines-per-function": ["error", { max: 60, skipBlankLines: true, skipComments: true }],
  "max-params": ["error", 4],
};
