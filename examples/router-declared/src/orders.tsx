/**
 * Lists the orders, each linking to its own page.
 */

import { type ReactElement } from "react";

import { Outlet, RouteLink } from "@stealthscale/provider-router";

import { order } from "#catalogue.ts";

/**
 * The orders this example lists, which come from nowhere because the page is about routing.
 */
const ORDERS = ["8801", "8802"] as const;

/**
 * Draws the list, and whichever order is open beside it.
 *
 * @remarks
 *   Each link names a reference rather than a path. This page does not know where the application
 *   mounted it, and the reference's type is what checks that `order` is the parameter to fill.
 * @returns The list and the outlet the open order draws in.
 */
export function Orders(): ReactElement {
  return (
    <main>
      <h1>{"Orders"}</h1>
      <ul>
        {ORDERS.map((number) => (
          <li key={number}>
            <RouteLink params={{ order: number }} to={order}>
              {`Order ${number}`}
            </RouteLink>
          </li>
        ))}
      </ul>
      <Outlet />
    </main>
  );
}
