/**
 * Draws the band holding the field a person types into, and the mark beside it.
 *
 * @remarks
 *   The field is the listbox's own, so it keeps focus while the highlight moves over the rows and
 *   the machine points `aria-activedescendant` at the row a reader is on.
 *   The mark is decoration and is hidden from the accessibility tree. This kit draws no artwork, so
 *   a caller hands one over or the field runs to the edge of the band.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { Listbox } from "@stealthscale/component-collections";

import { withContext } from "#command/context.ts";
import { useCommand } from "#command/state.ts";

/**
 * Draws the band at the size the panel states.
 */
const Banded = withContext("div", "control");

/**
 * Draws the mark beside the field.
 */
const Marked = withContext("span", "indicator", { defaultProps: { "aria-hidden": true } });

/**
 * Draws the field under both the palette's slot and the listbox's own.
 */
const Typed = withContext(Listbox.Input, "input");

/**
 * Describes what the field takes.
 */
export interface InputProps extends Omit<ComponentProps<typeof Typed>, "onChange" | "value"> {
  /**
   * The mark drawn beside the field, usually a magnifying glass.
   */
  readonly indicator?: ReactNode;
}

/**
 * Narrows the list to what a person types, without giving up focus.
 *
 * @param props - The mark beside it, and everything a styled field takes.
 * @returns The band, holding the mark and the field.
 */
export function Input({ indicator, ...rest }: InputProps): ReactElement {
  const palette = useCommand();

  return (
    <Banded>
      {indicator === undefined ? null : <Marked>{indicator}</Marked>}
      <Typed
        {...rest}
        onChange={(event) => {
          palette.narrow(event.target.value);
        }}
        value={palette.typed}
      />
    </Banded>
  );
}
