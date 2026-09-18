/**
 * Draws the frame every page under sales is shown in.
 */

import { type ReactElement } from "react";

import { type LayoutProps } from "@stealthscale/provider-router";

/**
 * Draws the frame, with whatever page the address named inside it.
 *
 * @remarks
 *   A layout is a pathless route, so the frame costs no path segment. Two pages naming it share
 *   one frame rather than one each.
 * @param props - The page below the frame.
 * @returns The frame.
 */
export function Sales({ children }: LayoutProps): ReactElement {
  return (
    <section aria-label="Sales">
      <p>{"Sales"}</p>
      {children}
    </section>
  );
}
