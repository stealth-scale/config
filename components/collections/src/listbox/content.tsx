/**
 * Draws the list itself.
 *
 * @remarks
 *   This part carries `role="listbox"` and the tab stop. Focus rests here and a highlight moves
 *   over the rows, which is why a row is never focused and why the machine points
 *   `aria-activedescendant` at the highlighted one from this element.
 *   It is what scrolls, so a label and a field above it stay put while the rows move.
 *   The element is `div` rather than `ul`. The role is stated outright and replaces whatever the
 *   element brought, so a list element buys nothing, and a group of rows drawn as a list item
 *   inside a list item is markup no browser accepts.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Draws the list at the size the root states.
 */
const Listed = withContext("div", "content");

/**
 * Describes what the content takes.
 */
export type ContentProps = ComponentProps<typeof Listed>;

/**
 * Carries the rows, and the highlight that moves over them.
 *
 * @param props - Everything a styled list takes.
 * @returns The list, carrying its role and the row a reader is on.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useListbox();

  return <Listed {...mergeProps(api.getContentProps(), props)} />;
}
