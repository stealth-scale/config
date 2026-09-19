/**
 * Draws one control in the header, and says how far it survives as the section narrows.
 *
 * @remarks
 *   A section folds on its own width rather than the page's, so a section in a narrow column drops
 *   its tertiary controls while the same section beside a wide one keeps them.
 *   The priority is an attribute rather than an axis of the recipe. A slot recipe's variants are
 *   set on the root and read by every part, so an axis would fold every control in the row the same
 *   way, and each one has to say for itself.
 */

import { type ComponentProps, type ReactElement } from "react";

import { PRIORITY, type Priority } from "#folding/index.ts";
import { withContext } from "#section/context.ts";

/**
 * Draws the control at the room the block states.
 */
const Acted = withContext("button", "action", { defaultProps: { type: "button" } });

/**
 * Describes what an action takes.
 */
export interface ActionProps extends ComponentProps<typeof Acted> {
  /**
   * How much the control matters, which decides what a narrow section does with it.
   */
  readonly priority?: Priority | undefined;
}

/**
 * Acts on the section, and gives way in the order its priority states.
 *
 * @param props - How much it matters, and everything a styled button takes.
 * @returns The control, carrying how far it survives.
 */
export function Action({ priority = "primary", ...rest }: ActionProps): ReactElement {
  return <Acted {...rest} {...{ [PRIORITY]: priority }} />;
}
