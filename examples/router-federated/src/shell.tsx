/**
 * Draws the menu this application puts around every page, whoever declared it.
 */

import { type FunctionComponent, type ReactElement } from "react";

import { Outlet, type RouteDeclaration, RouteLink } from "@stealthscale/provider-router";

import { labelOf } from "#declarations.ts";

/**
 * Builds the menu over whatever the other deployment declared.
 *
 * @remarks
 *   A factory rather than a component reading context, because the menu is drawn from the
 *   declarations and the router carries the compiled routes rather than what they came from. A
 *   deployment that is unreachable declares nothing, and the menu is then this application's own
 *   page alone.
 * @param declarations - The pages the other deployment contributes.
 * @param home - The id this application named its own page under.
 * @returns The shell, for the route everything hangs under.
 */
export function shellOf(
  declarations: readonly RouteDeclaration[],
  home: string,
): FunctionComponent {
  return function Shell(): ReactElement {
    return (
      <>
        <nav aria-label="Pages">
          <RouteLink to={home}>{"Home"}</RouteLink>
          {declarations.map((declaration) => (
            <RouteLink key={declaration.id} to={declaration.id}>
              {labelOf(declaration)}
            </RouteLink>
          ))}
        </nav>
        <Outlet />
      </>
    );
  };
}
