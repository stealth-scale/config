/**
 * Draws the words of whatever is chosen.
 *
 * @remarks
 *   A caller that draws its own summary needs none of this. It reads the machine's own text for
 *   the chosen rows, so a list of several answers one line rather than the caller joining them.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Draws the words at the size the root states.
 */
const Chosen = withContext("span", "valueText");

/**
 * Describes what the value text takes.
 */
export interface ValueTextProps extends ComponentProps<typeof Chosen> {
  /**
   * The words drawn while nothing is chosen.
   */
  readonly placeholder?: ReactNode;
}

/**
 * Reports what is chosen, and draws the placeholder while nothing is.
 *
 * @remarks
 *   Children override both. The source this was ported from tested the three with `||`, which
 *   passed an empty string over to the placeholder and also let a caller's children win silently.
 *   The empty case is named here, so the placeholder shows for nothing chosen and for nothing else.
 * @param props - The words for the empty case, and everything a styled span takes.
 * @returns The words of the chosen rows.
 */
export function ValueText({ children, placeholder, ...rest }: ValueTextProps): ReactElement {
  const api = useListbox();

  return (
    <Chosen {...mergeProps(api.getValueTextProps(), rest)}>
      {children ?? (api.valueAsString === "" ? placeholder : api.valueAsString)}
    </Chosen>
  );
}
