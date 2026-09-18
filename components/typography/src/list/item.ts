/**
 * Draws one entry in a list.
 *
 * @remarks
 *   The element is `li`, so the browser counts it and marks it. The entry draws its slot in the
 *   variants the root was given, and adds nothing of its own.
 */

import { type ComponentProps } from "react";

import { withContext } from "#list/context.ts";

/**
 * Draws one entry, marked by the browser or by an indicator the caller draws beside it.
 */
export const Item = withContext("li", "item");

/**
 * Describes what an entry takes: everything a styled list item element takes.
 */
export type ItemProps = ComponentProps<typeof Item>;
