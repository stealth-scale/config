/**
 * What a stylesheet is checked against beyond the shared set.
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
 * Everything this house asks of a stylesheet that the shared set does not.
 *
 * Most of Google's guide is already the shared set's: hyphen-separated class names, the unit
 * dropped after a zero, three-character hex, and shorthand where a longhand set is redundant. The
 * selector refusals, the cascade ones and the declaration order are the rest of it, which the
 * shared set leaves to whoever uses it. What a stylesheet may animate is nobody's guide and is here
 * because the fault it catches costs something at run time and nothing at build time.
 *
 * Two of Google's rules reach none of this. A leading zero and the choice of quotation mark used to
 * be stylelint's and are not any more: both were removed when it stopped checking layout, and the
 * formatter does them instead.
 *
 * @returns The rules, as stylelint takes them.
 */
export function all(): Record<string, unknown> {
  return { ...SELECTOR, ...CASCADE, ...ORDER, ...ANIMATION };
}
