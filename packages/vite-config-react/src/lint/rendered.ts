/**
 * What a specification written as markup is excused.
 */

import { type Contribution, lint } from "@stealthscale/vite-config";

/**
 * The files a specification writes markup in.
 *
 * Markup is the only reason a specification is written `.tsx`, so these exist wherever a package
 * renders and nowhere else. The toolchain excuses the `.ts` pair on its own.
 */
const RENDERED = ["**/*.spec.tsx", "**/*.fixtures.tsx"];

/**
 * Excuses a rendered specification the docblock rules, as the toolchain excuses a plain one.
 *
 * Stated by the workspace rather than by a tier. `lint` is read from the root config and nowhere
 * else, and a root takes the node tier whatever its packages render — so the tier that knows about
 * `.tsx` specifications is never the one the linter reads, and without this they are held to a
 * standard the same file in `.ts` is excused.
 *
 * @returns The contribution.
 */
export function rendered(): Contribution {
  return lint.undocumented(RENDERED);
}
