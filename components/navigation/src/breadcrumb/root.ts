/**
 * Draws the landmark the trail sits in.
 *
 * @remarks
 *   The element is `nav`, which is the landmark a person navigating by landmark reaches. It is
 *   named by default, because a page usually holds more than one navigation landmark and an
 *   unnamed one is announced as `navigation` with nothing to tell it from the others. A caller
 *   with a better name states it, and a page with one trail loses nothing by keeping this.
 */

import { type ComponentProps } from "react";

import { withProvider } from "#breadcrumb/context.ts";

/**
 * Draws the landmark and sets the size and look every part below it reads.
 */
export const Root = withProvider("nav", "root", {
  defaultProps: { "aria-label": "Breadcrumb" },
});

/**
 * Describes what the landmark takes.
 */
export type RootProps = ComponentProps<typeof Root>;
