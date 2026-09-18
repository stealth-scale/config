/**
 * Draws the place on the page the skip link jumps to.
 *
 * @remarks
 *   The element is `div` and takes a tab index of minus one, because a browser moves focus to the
 *   target of a fragment only where the target can hold focus, and minus one holds focus without
 *   putting the target in the tab order. A page whose content is its main region changes the
 *   element with `as="main"`.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#skip-nav/context.ts";
import { SKIP_NAV_TARGET } from "#skip-nav/link.ts";

/**
 * Takes the focus the skip link sends, and draws nothing.
 */
export const Target = withProvider("div", "target", {
  defaultProps: { id: SKIP_NAV_TARGET, tabIndex: -1 },
});

/**
 * Describes what the target takes: everything a styled div element takes.
 */
export type TargetProps = ComponentProps<typeof Target>;
