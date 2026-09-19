/**
 * Draws the row the bands sit in, and moves one tab stop across the controls inside it.
 *
 * @remarks
 *   The element carries `role="toolbar"`, which is what tells a screen reader that the arrow keys
 *   move between the controls and that Tab leaves the row rather than walking it. The roving focus
 *   group behind it is the accessibility package's, so the keyboard behaviour is written once.
 *   Name the row. A screen holds more than one toolbar, and an unnamed one is announced as
 *   `toolbar` with nothing to say what it acts on.
 */

import { type ComponentProps, type ReactElement } from "react";

import { RovingFocus } from "@stealthscale/component-a11y";

import { withProvider } from "#toolbar/context.ts";

/**
 * Draws the row under both the toolbar's slot and the roving focus group's own.
 */
const Rowed = withProvider(RovingFocus.Root, "root");

/**
 * Describes what the row takes.
 */
export interface RootProps extends ComponentProps<typeof Rowed> {
  /**
   * The words naming what the toolbar acts on.
   */
  readonly "aria-label": string;
}

/**
 * Gathers the controls that act on what is beside them, under one tab stop.
 *
 * @param props - The recipe's variants, the group's options and the element's props together.
 * @returns The row, holding the bands.
 */
export function Root(props: RootProps): ReactElement {
  return <Rowed role="toolbar" {...props} />;
}
