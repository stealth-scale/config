/**
 * What a stylesheet may do to the order rules are applied in.
 */

/**
 * The refusals that keep the cascade readable.
 *
 * `!important` wins over the cascade rather than taking part in it, so the next person cannot
 * reason about which rule applies by reading the stylesheet: they have to find every `!important`
 * first. Google refuses it outright.
 *
 * Specificity running backwards is the same problem arrived at by accident. A selector written
 * after a more specific one that targets the same element never applies, and nothing says so — the
 * rule is simply dead. A duplicate selector is the mildest version: two blocks for one thing, where
 * only the second is read and the first is a lie.
 */
export const CASCADE = {
  "declaration-no-important": true,
  "no-descending-specificity": true,
  "no-duplicate-selectors": true,
};
