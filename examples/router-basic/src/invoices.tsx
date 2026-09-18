/**
 * Lists the invoices, each linking to its own page.
 */

import { type ReactElement } from "react";

import { Link, Outlet } from "@tanstack/react-router";

/**
 * The invoices this example lists, which come from nowhere because the page is about routing.
 */
const INVOICES = ["4102", "4103"] as const;

/**
 * Draws the list, and whichever invoice the address names beside it.
 *
 * @remarks
 *   `to` and `params` are both checked against the registered tree, so a path this application
 *   does not serve is a compile error rather than a blank page.
 * @returns The list and the outlet the open invoice draws in.
 */
export function Invoices(): ReactElement {
  return (
    <main>
      <h1>{"Invoices"}</h1>
      <ul>
        {INVOICES.map((id) => (
          <li key={id}>
            <Link params={{ id }} search={{ tab: "lines" }} to="/invoices/$id">
              {`Invoice ${id}`}
            </Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </main>
  );
}
