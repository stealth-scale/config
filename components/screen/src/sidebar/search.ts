/**
 * Draws the field that narrows what the blocks hold.
 *
 * @remarks
 *   It leaves a collapsed sidebar, because a rail has no room for a field and a field squeezed to
 *   nothing is one nobody types in. Put the forms package's search field inside it with `as`.
 *   Narrowing is the caller's. This states the room the field keeps and nothing about what it
 *   finds.
 */

import { type ComponentProps } from "react";

import { withContext } from "#sidebar/context.ts";

/**
 * Draws the field at the room the column states.
 */
export const Search = withContext("div", "search");

/**
 * Describes what the search takes.
 */
export type SearchProps = ComponentProps<typeof Search>;
