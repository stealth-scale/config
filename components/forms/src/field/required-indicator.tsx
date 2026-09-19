/**
 * Draws the mark on a field that has to be filled in.
 *
 * @remarks
 *   The element is `span`, drawn inside the label and hidden from a screen reader. The control
 *   states `required`, which is what a reader is told, and a mark read aloud would repeat it as a
 *   glyph.
 *   It renders nothing where the field is optional, so the mark and the attribute never disagree.
 *   The mark carries no meaning on its own. A form where most fields are required states that
 *   above the form and marks the optional ones in words instead.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#field/context.ts";
import { useField } from "#field/state.ts";

/**
 * Draws the mark in the error ink.
 */
const Marked = withContext("span", "requiredIndicator", {
  defaultProps: { "aria-hidden": true, children: "*" },
});

/**
 * Describes what the mark takes: everything a styled span takes.
 */
export type RequiredIndicatorProps = ComponentProps<typeof Marked>;

/**
 * Marks the field as one that has to be filled in.
 *
 * @param props - Everything a styled span takes.
 * @returns The mark, or nothing where the field is optional.
 */
export function RequiredIndicator(props: RequiredIndicatorProps): ReactElement | undefined {
  const { required } = useField();

  if (!required) return undefined;

  return <Marked {...props} />;
}
