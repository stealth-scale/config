/**
 * Draws what the table is about.
 *
 * @remarks
 *   The element is `caption`, which a screen reader reads as the table's name before its first
 *   cell. A table with no caption is announced by its size alone, so a page holding two of them
 *   gives a reader nothing to tell them apart.
 *   It sits below the table, because a caption read after the figures is the one a reader returns
 *   to. Give it an `id` and point the scroller's `aria-labelledby` at it, so the box that scrolls
 *   carries the same name the table does.
 */

import { type ComponentProps } from "react";

import { withContext } from "#table/context.ts";

/**
 * Captions the table, which is the name a screen reader reads first.
 */
export const Caption = withContext("caption", "caption");

/**
 * Describes what the caption takes: everything a styled caption takes.
 */
export type CaptionProps = ComponentProps<typeof Caption>;
