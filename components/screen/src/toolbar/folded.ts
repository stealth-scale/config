/**
 * Draws the control that holds whatever the row dropped as it narrowed.
 *
 * @remarks
 *   It appears only on a narrow row, because a row keeping every control has nothing to put behind
 *   it. Put a menu in it holding the same actions the tertiary controls do.
 *   Name it. `More` says nothing about what it opens; `More invoice actions` does.
 */

import { type ComponentProps } from "react";

import { withContext } from "#toolbar/context.ts";
import { Item } from "#toolbar/item.tsx";

/**
 * Draws the control under both the toolbar's slot and the roving focus group's own.
 */
export const Folded = withContext(Item, "folded");

/**
 * Describes what the folded control takes.
 */
export type FoldedProps = ComponentProps<typeof Folded>;
