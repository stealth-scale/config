/**
 * Draws the rule parting one set of controls from the next.
 *
 * @remarks
 *   The layout package's divider drawn under a slot of this toolbar's own, because a rule in a row
 *   of controls has to stretch to the row's height rather than sit at a length of its own.
 *   It runs down the row rather than across it, so it states both the divider's `vertical`
 *   orientation and `aria-orientation`. The element's `separator` role reads as horizontal where
 *   nothing says otherwise, which would tell a reader the rule parts what is above it from what is
 *   below it when it parts what leads it from what follows.
 *   It keeps that role. A rule in a toolbar parts one set of controls from the next, which is a
 *   grouping a reader gets no other way, so it is meaningful rather than decorative. State
 *   `aria-hidden` on one drawn purely for rhythm.
 */

import { type ComponentProps } from "react";

import { Divider } from "@stealthscale/component-layout";

import { withContext } from "#toolbar/context.ts";

/**
 * Draws the rule stretched to the row's height, standing on its end.
 */
export const Separator = withContext(Divider, "separator", {
  defaultProps: { "aria-orientation": "vertical", orientation: "vertical" },
});

/**
 * Describes what the rule takes.
 */
export type SeparatorProps = ComponentProps<typeof Separator>;
