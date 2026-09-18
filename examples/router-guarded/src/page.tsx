/**
 * Draws whichever report the address named.
 */

import { type ReactElement } from "react";

import { useDeclaredRoute } from "@stealthscale/provider-router";

/**
 * Draws the id of the route this page was compiled for.
 *
 * @remarks
 *   One component serves all three pages. It reads which route it is drawing off the match, which
 *   the compiler named rather than the page having to be told.
 * @returns The page's own id.
 */
export function Page(): ReactElement {
  const declared = useDeclaredRoute();

  return <article>{declared === undefined ? "none" : declared.id}</article>;
}
