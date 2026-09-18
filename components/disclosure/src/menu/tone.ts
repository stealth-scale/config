/**
 * States what a row of a menu is for, which decides the ink it is drawn in.
 *
 * @remarks
 *   This is a prop rather than an axis of the recipe, because a slot recipe resolves its variants
 *   once at the root and a menu draws one row in a different ink from the rest. The row writes it
 *   as a data attribute and the recipe's base styles it, which is the hook a theme extends to add
 *   another.
 */

/**
 * Selects what a row is for.
 *
 * @remarks
 *   A row that undoes something is the one case a menu draws differently, and colour is a second
 *   reading of what its words already say rather than the only one.
 */
export type Tone = "critical";
