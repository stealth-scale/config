/**
 * Draws the box the words appear in.
 *
 * @remarks
 *   The machine gives it the tooltip role and the id the trigger points at, so a screen reader
 *   reads the words as a description of the control rather than as something beside it.
 *   It states its surface once as a custom property, which the point inside it reads, so the two
 *   are never filled in different colours.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#tooltip/context.ts";
import { useTooltip } from "#tooltip/machine.ts";

/**
 * Draws the box at the size the root states.
 */
const Boxed = withContext("div", "content");

/**
 * Describes what the box takes.
 */
export type ContentProps = ComponentProps<typeof Boxed>;

/**
 * Appears beside the control while a pointer rests on it.
 *
 * @param props - The recipe's variants, and everything a styled div takes.
 * @returns The box, named and placed by the machine.
 */
export function Content(props: ContentProps): ReactElement {
  const api = useTooltip();

  return <Boxed {...mergeProps(api.getContentProps(), props)} />;
}
