/**
 * Draws what sits against the end of an alert.
 *
 * @remarks
 *   The element is `div` and holds what a reader does about the alert: a control that dismisses
 *   it, a link to what went wrong, a retry.
 *   A control here is named by the caller, and the name says what it acts on. `Dismiss` alone is
 *   read out of context by a screen reader moving control to control, where `Dismiss this warning`
 *   is not.
 */

import { type ComponentProps } from "react";

import { withContext } from "#alert/context.ts";

/**
 * Sets whatever a reader does about the alert against its end.
 */
export const Aside = withContext("div", "aside");

/**
 * Describes what the band takes: everything a styled div takes.
 */
export type AsideProps = ComponentProps<typeof Aside>;
