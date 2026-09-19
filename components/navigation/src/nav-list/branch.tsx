/**
 * Draws a row that opens onto a list of its own, and holds whether that list is shown.
 *
 * @remarks
 *   The element is `li`, because a branch is a row of the list around it. It takes `open` and
 *   `defaultOpen`, so a caller that opens the branch holding the current page drives it and a
 *   caller that does not is served by the same component.
 */

import { type ComponentProps, type ReactElement, useId } from "react";

import { useControllableState } from "@stealthscale/hooks";

import { withContext } from "#nav-list/context.ts";
import { BranchProvider } from "#nav-list/state.ts";

/**
 * Draws the branch at the size the list states.
 */
const Held = withContext("li", "branch");

/**
 * Describes what a branch takes.
 */
export interface BranchProps extends Omit<ComponentProps<typeof Held>, "id"> {
  /**
   * Whether the list is shown before a caller drives it.
   */
  readonly defaultOpen?: boolean | undefined;

  /**
   * The identifier the trigger points at the list with, which is generated where you state none.
   */
  readonly id?: string | undefined;

  /**
   * Hears the branch open and close.
   */
  readonly onOpenChange?: ((open: boolean) => void) | undefined;

  /**
   * Whether the list is shown, where a caller drives it.
   */
  readonly open?: boolean | undefined;
}

/**
 * Shows and hides the list beneath its row.
 *
 * @param props - Whether the branch is open, and everything a styled list item takes.
 * @returns The branch, holding the trigger and the list under its state.
 */
export function Branch({
  defaultOpen = false,
  id,
  onOpenChange,
  open,
  ...rest
}: BranchProps): ReactElement {
  const generated = useId();
  const [shown, setShown] = useControllableState<boolean>({
    defaultValue: defaultOpen,
    onChange: onOpenChange,
    value: open,
  });

  return (
    <BranchProvider
      value={{
        id: id ?? generated,
        open: shown,
        toggle: () => {
          setShown(!shown);
        },
      }}
    >
      <Held {...rest} />
    </BranchProvider>
  );
}
