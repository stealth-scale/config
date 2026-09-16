/**
 * Keeps a conflict between two rules settled by the cascade alone.
 */

/**
 * Rejects the three declarations that settle a conflict outside the cascade.
 *
 * @remarks
 *   An author reaches for `!important` to beat a rule elsewhere, and the next
 *   author has nothing left to beat it with. Descending specificity and a
 *   duplicated selector each produce a block that never applies, and neither
 *   is visible at the line where it was written.
 */
export const CASCADE = {
  "declaration-no-important": true,
  "no-descending-specificity": true,
  "no-duplicate-selectors": true,
};
