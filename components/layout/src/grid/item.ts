/**
 * Draws one entry of a grid, which may reach across more than one column.
 *
 * @remarks
 *   An entry states nothing about the grid it is in beyond how far it reaches, so a grid of one
 *   column and a grid of twelve hold the same entry. The span is read from the root, which is
 *   where a caller states the grid's shape.
 */

import { type ComponentProps } from "react";

import { withContext } from "#grid/context.ts";

/**
 * Draws one cell, reaching across the columns the grid's span names.
 */
export const Item = withContext("div", "item");

/**
 * Describes what an entry takes: everything a styled div element takes.
 */
export type ItemProps = ComponentProps<typeof Item>;
