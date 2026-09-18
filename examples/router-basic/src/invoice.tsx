/**
 * Draws one invoice, on whichever tab the search string names.
 */

import { type ReactElement } from "react";

import { Link, useParams, useSearch } from "@tanstack/react-router";

/**
 * Draws the invoice's number and the tab it is open on.
 *
 * @remarks
 *   Neither hook is told which route it is reading. The registered router type carries the path,
 *   so `id` is a string and `tab` is one of the two the search validator allows, both worked out
 *   by the compiler.
 * @returns The invoice's number, its tabs, and the tab it is open on.
 */
export function Invoice(): ReactElement {
  const { id } = useParams({ from: "/invoices/$id" });
  const { tab } = useSearch({ from: "/invoices/$id" });

  return (
    <article>
      <h2>{`Invoice ${id}`}</h2>
      <nav>
        <Link params={{ id }} search={{ tab: "lines" }} to="/invoices/$id">
          {"Lines"}
        </Link>
        <Link params={{ id }} search={{ tab: "history" }} to="/invoices/$id">
          {"History"}
        </Link>
      </nav>
      <p>{`Showing the ${tab}.`}</p>
    </article>
  );
}
