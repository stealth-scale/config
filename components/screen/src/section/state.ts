/**
 * Carries what a section knows about itself down to its parts.
 *
 * @remarks
 *   The block names itself after its own title. The title states the identifier the block points
 *   `aria-labelledby` at, so a section is a landmark a reader can jump to without a caller writing
 *   a matching pair of attributes and keeping them in step. A block whose title is absent points at
 *   nothing, which every screen reader passes over, so it is a grouping and announces as nothing.
 *   The identifier is derived rather than registered. A title that told the block it existed would
 *   be writing state from an effect, which React 19 reports, and the block would draw once without
 *   a name before the second render gave it one.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes what every part of a section reads.
 */
export interface SectionState {
  /**
   * Whether the block is narrower than a two-column header needs.
   */
  narrow: boolean;

  /**
   * The identifier the title carries and the block names itself by.
   */
  titleId: string;
}

/**
 * Hands the section's state to its parts, and reads it back.
 */
export const [SectionProvider, useSection, useOptionalSection] =
  createRequiredContext<SectionState>("Section");
