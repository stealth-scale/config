/**
 * Draws the frame this application puts around every page, whoever declared it.
 */

import { type FunctionComponent, type ReactElement } from "react";

import { Outlet, type RouteDeclaration } from "@stealthscale/provider-router";

import { type Condition } from "#catalogue.ts";
import { Menu } from "#menu.tsx";

/**
 * Builds the shell over one set of declarations.
 *
 * @remarks
 *   A factory rather than a component reading context, because the menu is drawn from the
 *   declarations and the router carries the compiled routes rather than what they came from.
 * @param declarations - The routes that arrived as data, which the menu is drawn from.
 * @returns The shell, for the route this application mounts everything under.
 */
export function shellOf(
  declarations: ReadonlyArray<RouteDeclaration<Condition>>,
): FunctionComponent {
  return function Shell(): ReactElement {
    return (
      <>
        <Menu declarations={declarations} />
        <Outlet />
      </>
    );
  };
}
