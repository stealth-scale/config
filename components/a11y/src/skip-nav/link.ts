/**
 * Draws the link that carries a keyboard past the navigation.
 *
 * @remarks
 *   The element is `a` pointed at a fragment, because a link is what a browser moves focus with
 *   and what a screen reader reads as a link. It is the first thing in the document so a keyboard
 *   meets it before anything else, and it names where it goes rather than saying only "skip".
 */

import { type ComponentProps } from "react";

import { withProvider } from "#skip-nav/context.ts";

/**
 * The fragment the link points at and the target answers to, where neither states one.
 */
export const SKIP_NAV_TARGET = "content";

/**
 * Jumps a keyboard past the navigation to the page's content.
 */
export const Link = withProvider("a", "link", {
  defaultProps: { href: `#${SKIP_NAV_TARGET}` },
});

/**
 * Describes what the link takes: everything a styled anchor element takes.
 */
export type LinkProps = ComponentProps<typeof Link>;
