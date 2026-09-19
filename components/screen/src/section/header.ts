/**
 * Draws the band holding the title, what it explains and what acts on it.
 *
 * @remarks
 *   The element is `header`, which is a banner landmark only at the top of a document and plain
 *   content inside a `section`, so a page of these adds no landmarks.
 *   It is a grid of two rows, so the title, the actions and the description are written flat and
 *   placed by name rather than nested to get their positions.
 */

import { type ComponentProps } from "react";

import { withContext } from "#section/context.ts";

/**
 * Draws the band at the room the block states.
 */
export const Header = withContext("header", "header");

/**
 * Describes what the header takes.
 */
export type HeaderProps = ComponentProps<typeof Header>;
