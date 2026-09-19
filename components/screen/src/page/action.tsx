/**
 * Draws one control in the header, and says how far it survives as the page narrows.
 *
 * @remarks
 *   A page cannot keep every control at every width. Each one says how much it matters and the
 *   recipe decides what happens to it: a primary control keeps its words, a secondary one keeps its
 *   mark and reads its words to a screen reader alone, and a tertiary one leaves the row.
 *   The priority is an attribute rather than an axis of the recipe. A slot recipe's variants are
 *   set on the root and read by every part, so an axis would fold every control in the row the same
 *   way, and each one has to say for itself.
 *   Whatever a tertiary control does has to be reachable elsewhere on a narrow page. Put it behind
 *   `Page.Folded`, which is drawn only there.
 */

import { type ComponentProps, type ReactElement } from "react";

import { PRIORITY, type Priority } from "#folding/index.ts";
import { withContext } from "#page/context.ts";

/**
 * Draws the control at the room the column states.
 */
const Acted = withContext("button", "action", { defaultProps: { type: "button" } });

/**
 * Describes what an action takes.
 */
export interface ActionProps extends ComponentProps<typeof Acted> {
  /**
   * How much the control matters, which decides what a narrow page does with it.
   */
  readonly priority?: Priority | undefined;
}

/**
 * Acts on the page, and gives way in the order its priority states.
 *
 * @param props - How much it matters, and everything a styled button takes.
 * @returns The control, carrying how far it survives.
 */
export function Action({ priority = "primary", ...rest }: ActionProps): ReactElement {
  return <Acted {...rest} {...{ [PRIORITY]: priority }} />;
}
