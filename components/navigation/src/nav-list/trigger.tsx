/**
 * Draws the row that opens a branch.
 *
 * @remarks
 *   The element is `button`, because it acts on the page rather than going anywhere. It says
 *   whether the list is expanded and which list it controls, both from the branch's own state, so
 *   a caller states neither and the two cannot drift apart.
 *   A branch whose own page is the one being read states `aria-current="page"` here, the same as a
 *   link does, and the `highlight` axis marks it the same way.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#nav-list/context.ts";
import { useBranch } from "#nav-list/state.ts";

/**
 * Draws the row at the size the list states.
 */
const Opened = withContext("button", "trigger");

/**
 * Describes what a trigger takes.
 */
export type TriggerProps = Omit<
  ComponentProps<typeof Opened>,
  "aria-controls" | "aria-expanded" | "type"
>;

/**
 * Shows the list beneath the row where it is hidden, and hides it where it is shown.
 *
 * @param props - Everything a styled button takes, less what the branch states.
 * @returns The row, saying what it controls and whether that list is open.
 */
export function Trigger({ onClick, ...rest }: TriggerProps): ReactElement {
  const branch = useBranch();

  return (
    <Opened
      {...rest}
      aria-controls={branch.id}
      aria-expanded={branch.open}
      data-state={branch.open ? "open" : "closed"}
      onClick={(event) => {
        onClick?.(event);
        branch.toggle();
      }}
      type="button"
    />
  );
}
