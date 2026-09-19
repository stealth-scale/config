/**
 * Draws the box the field and its marks sit in.
 *
 * @remarks
 *   The element is `div` and carries no role. The field inside it keeps its own, and a role here
 *   would announce a grouping that is not one.
 *   The root states the variants every part below it reads, so a caller sets the size once and the
 *   field's room and the marks' boxes step together.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#input-group/context.ts";

/**
 * Wraps the field and its marks, and sets the variants they share.
 */
export const Root = withProvider("div", "root");

/**
 * Describes what the box takes: the recipe's variants, and everything a styled div takes.
 */
export type RootProps = ComponentProps<typeof Root>;
