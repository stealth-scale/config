/**
 * Collects the rule sets kept in this directory into the one record Stylelint
 * is configured with.
 */

import { ANIMATION } from "#rules/animation.ts";
import { CASCADE } from "#rules/cascade.ts";
import { ORDER } from "#rules/order.ts";
import { SELECTOR } from "#rules/selector.ts";

export { ANIMATION } from "#rules/animation.ts";
export { CASCADE } from "#rules/cascade.ts";
export { ORDER } from "#rules/order.ts";
export { SELECTOR } from "#rules/selector.ts";

/**
 * Merges the four rule sets into the record the check hands Stylelint.
 *
 * @remarks
 *   No rule name appears in two sets, so the merge settles nothing and the
 *   result holds as many entries as the sets do together. A rule the shared
 *   guide already turns on belongs in neither set, and a repository adding one
 *   overrides this record rather than editing a set.
 * @returns Every rule the check turns on, by Stylelint rule name.
 */
export function all(): Record<string, unknown> {
  return { ...SELECTOR, ...CASCADE, ...ORDER, ...ANIMATION };
}
