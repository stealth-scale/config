/**
 * Draws the panel every other part sits in.
 *
 * @remarks
 *   The element is `div` and carries no role. What an empty state means is in its words, and a
 *   region role on every one of them would make a page of empty panels a page of landmarks. A page
 *   that wants the panel announced states its own role on it.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#empty-state/context.ts";

/**
 * Draws the panel and sets the size every part below it reads.
 */
export const Root = withProvider("div", "root");

/**
 * Describes what the panel takes.
 */
export type RootProps = ComponentProps<typeof Root>;
