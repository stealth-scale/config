/**
 * Draws the box an alert's parts sit in, and decides how it is announced.
 *
 * @remarks
 *   The element is `div`. Its role follows `live`, because the role is what decides whether a
 *   reader who is not looking at the alert hears it at all. An alert raised in answer to something
 *   a person did takes `assertive`, one that reports progress takes `polite`, and one that is part
 *   of the page from the first paint takes `off`.
 *   A live region announces what changes inside it after it is in the document. An alert mounted
 *   with its words already in place may reach a reader late or not at all, so a page that raises
 *   alerts keeps the region mounted and empty and fills it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#alert/context.ts";
import { type Live, ROLES } from "#alert/live.ts";

/**
 * Draws the box and states the variants every part reads.
 */
const Framed = withProvider("div", "root");

/**
 * Describes what an alert takes: the recipe's variants, how loudly it is announced, and everything
 * a styled div takes.
 */
export interface RootProps extends ComponentProps<typeof Framed> {
  /**
   * How an alert reaches a reader who is not looking at it. Default: `polite`.
   */
  readonly live?: Live | undefined;
}

/**
 * Draws the alert, in the role its loudness asks for.
 *
 * @param props - The variants, the loudness, and the element's own props.
 * @returns The box, holding the parts, under the role that announces it.
 */
export function Root({ live = "polite", ...rest }: RootProps): ReactElement {
  return <Framed {...ROLES[live]} {...rest} />;
}
