/**
 * Draws the list the rows sit in.
 *
 * @remarks
 *   The element is `ul`, so a screen reader counts the destinations and says how many there are.
 *   The list carries no landmark of its own. A page holds more than one of these, and the landmark
 *   belongs to whatever names the set: a sidebar's `nav`, a page's own, or a caller's `as="nav"`.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#nav-list/context.ts";

/**
 * Draws the list and sets the variants every part below it reads.
 */
export const Root = withProvider("ul", "root");

/**
 * Describes what the list takes.
 */
export type RootProps = ComponentProps<typeof Root>;
