/**
 * Draws the column the mark and the words are centred in.
 */

import { type ComponentProps } from "react";

import { withContext } from "#empty-state/context.ts";

/**
 * Centres what it holds, in a column, at the gap its size states.
 */
export const Content = withContext("div", "content");

/**
 * Describes what the content takes.
 */
export type ContentProps = ComponentProps<typeof Content>;
