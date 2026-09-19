/**
 * States whether a band stays put as the page scrolls under it.
 *
 * @remarks
 *   Written as a prop on the band rather than as an attribute a caller remembers, so the type
 *   system carries it and a band that is meant to stick cannot be one that silently does not. The
 *   recipe reads the attribute this writes.
 */

/**
 * Describes what any band that can stay put takes beyond its element's own props.
 */
export interface StickyProps {
  /**
   * Whether the band stays put as the page scrolls under it.
   */
  readonly sticky?: boolean | undefined;
}

/**
 * Turns the prop into the attribute the recipe reads.
 *
 * @param sticky - Whether the band stays put.
 * @returns The attribute where it does, and nothing where it does not.
 */
export function stuck(sticky?: boolean): "" | undefined {
  return sticky === true ? "" : undefined;
}
