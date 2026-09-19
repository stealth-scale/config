/**
 * Carries the identifier a block of destinations names itself by down to its heading.
 *
 * @remarks
 *   The block derives the identifier and the heading carries it, so a caller writes neither and the
 *   two cannot drift apart. A heading drawn outside a block throws where it was written rather than
 *   naming nothing and saying so nowhere.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes what the parts of a block read.
 */
export interface NavState {
  /**
   * The identifier the heading carries and the block names itself by.
   */
  labelId: string;
}

/**
 * Hands the block's identifier to its heading, and reads it back.
 */
export const [NavProvider, useNav] = createRequiredContext<NavState>("Sidebar.Nav");
