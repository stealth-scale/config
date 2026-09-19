/**
 * Draws one control in the row, and says how far it survives as the row narrows.
 *
 * @remarks
 *   The control takes the row's roving tab stop, so it is drawn as an item rather than inside one.
 *   A control nested in an item carries a second stop and the row then has two for one control,
 *   which is not what `role="toolbar"` promises.
 *   The priority is an attribute rather than an axis of the recipe. A slot recipe's variants are
 *   set on the root and read by every part, so an axis would fold every control in the row the same
 *   way, and each one has to say for itself.
 */

import { type ComponentProps, type ReactElement } from "react";

import { PRIORITY, type Priority } from "#folding/index.ts";
import { withContext } from "#toolbar/context.ts";
import { Item } from "#toolbar/item.tsx";

/**
 * Draws the control under both the toolbar's slot and the roving focus group's own.
 */
const Acted = withContext(Item, "action");

/**
 * Describes what an action takes.
 */
export interface ActionProps extends ComponentProps<typeof Acted> {
  /**
   * How much the control matters, which decides what a narrow row does with it.
   */
  readonly priority?: Priority | undefined;
}

/**
 * Acts on what the toolbar sits above, and gives way in the order its priority states.
 *
 * @param props - How much it matters, and everything an item takes.
 * @returns The control, carrying the row's tab stop and how far it survives.
 */
export function Action({ priority = "primary", ...rest }: ActionProps): ReactElement {
  return <Acted {...rest} {...{ [PRIORITY]: priority }} />;
}
