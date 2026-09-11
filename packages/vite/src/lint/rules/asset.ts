/**
 * What a package imports that a bundler turns into something other than a module.
 */

import { type Rules } from "#lint/rules/rules.ts";

/**
 * The extensions a bundler turns into something other than a module.
 *
 * A stylesheet is the one that matters today. The rest are here because the reason is identical and
 * discovering it a second time per file kind is waste.
 */
const BUNDLED = ["**/*.css", "**/*.scss", "**/*.less"];

/**
 * The refusals that have to know a bundler is involved.
 *
 * An import with nothing assigned from it is usually a mistake — a module imported and then never
 * read. A stylesheet is the exception and not a rare one: the import _is_ the instruction, and
 * there is nothing to assign because a stylesheet exports nothing. Named rather than turned off, so
 * an unread module is still caught everywhere else.
 */
export const ASSET: Rules = {
  "no-unassigned-import": ["error", { allow: BUNDLED }],
};
