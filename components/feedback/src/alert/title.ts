/**
 * Draws what an alert says first.
 *
 * @remarks
 *   The element is `span` rather than a heading, because an alert is read out as one run and a
 *   heading inside a live region puts a level into the outline for something that is gone a moment
 *   later. A notice that stays on the page and belongs in the outline takes `as="h2"` or the level
 *   the page needs.
 *   The title is where the status is said in words. An alert whose status reaches a reader through
 *   its palette and its mark alone fails WCAG 1.4.1.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Says what the alert is about.
 */
export const Title = withContext("span", "title");

/**
 * Describes what the title takes: everything a styled span takes.
 */
export type TitleProps = ComponentProps<typeof Title>;
