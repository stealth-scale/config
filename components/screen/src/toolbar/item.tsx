/**
 * Draws one control in the row, holding the single tab stop the arrows move.
 *
 * @remarks
 *   A toolbar has one tab stop and the arrows move it, which is what `role="toolbar"` promises a
 *   screen reader. The roving focus group puts that stop on the item's own element, so the control
 *   has to be the item rather than sit inside one: a button nested in an item carries a second stop
 *   and the row then has two for one control.
 *   The element is decided here rather than through `as`, and that is what lets a slot be bound
 *   around this. A bound component reads `as` to decide what to render, so an `as` written on the
 *   binding replaces this component rather than reaching it, and the control would be drawn outside
 *   the roving group without saying so.
 *   A control draws a `button` and states `type="button"`, so one inside a form does not submit it.
 *   Passing `href` draws an `a` instead, for a control that goes somewhere.
 */

import { type ComponentProps, type ReactElement } from "react";

import { RovingFocus } from "@stealthscale/component-a11y";

/**
 * Describes what the roving focus group takes from an item, less the element it draws.
 */
type Roving = Omit<ComponentProps<typeof RovingFocus.Item>, "as" | "ref">;

/**
 * Describes what a control in the row takes.
 */
export interface ItemProps extends Roving {
  /**
   * Where the control goes, which draws it as a link rather than a button.
   */
  readonly href?: string | undefined;
}

/**
 * Acts on what the toolbar sits above, and takes the row's tab stop while it holds it.
 *
 * @param props - Where it goes for a link, and everything an item takes.
 * @returns The control, carrying the row's tab stop.
 */
export function Item({ href, ...rest }: ItemProps): ReactElement {
  const control =
    href === undefined ? { as: "button", type: "button", ...rest } : { as: "a", href, ...rest };

  // The element and its own attributes are decided together above. A bound component types its
  // props as the element it was bound to whatever it renders, so the pair cannot be handed over as
  // one without saying so here.
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
  return <RovingFocus.Item {...(control as ComponentProps<typeof RovingFocus.Item>)} />;
}
