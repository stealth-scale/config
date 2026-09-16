/**
 * Takes the slots of a slot recipe from the anatomy of the component it draws.
 *
 * @remarks
 *   An anatomy lists its parts once, and a recipe that restated them would drift from it. The
 *   compiler's definition takes a mutable array, so the parts are copied into one.
 */

/**
 * Describes the one thing read from an anatomy: the parts it names.
 *
 * @typeParam Part - Each part's name.
 */
export interface Anatomy<Part extends string> {
  /**
   * Lists the parts the anatomy stamps.
   */
  keys: () => readonly Part[];
}

/**
 * Takes the parts of an anatomy as the slots of a recipe, typed as the tuple of their names.
 *
 * @typeParam Part - Each part's name.
 */
export function slotsOf<const Part extends string>(anatomy: Anatomy<Part>): Part[] {
  return [...anatomy.keys()];
}
