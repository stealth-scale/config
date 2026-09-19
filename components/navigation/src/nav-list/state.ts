/**
 * Carries what a branch knows about itself down to the three parts that draw it.
 *
 * @remarks
 *   The branch holds its own open state rather than borrowing the collapsible. A collapsible's
 *   trigger reads the control scale, which would put a second height on a row that already states
 *   one, and the height a reader saw would come down to the order the stylesheet was written in. A
 *   branch needs a button, an expanded state and a list that is there or is not, and that is all
 *   this holds.
 */

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes what the three parts of a branch read.
 */
export interface BranchState {
  /**
   * The identifier the trigger points at the list with.
   */
  id: string;

  /**
   * Whether the list beneath the row is shown.
   */
  open: boolean;

  /**
   * Shows the list where it is hidden, and hides it where it is shown.
   */
  toggle: () => void;
}

/**
 * Hands the branch's state to its parts, and reads it back.
 */
export const [BranchProvider, useBranch] = createRequiredContext<BranchState>("NavList.Branch");
