/**
 * Reads the routes that arrive as data, then starts the application over them.
 *
 * @remarks
 *   The declarations are read before the router is built, because the tree is a function of them.
 *   What loads late is each page's own bundle, which the compiler defers until somebody navigates.
 */

import { createRoot } from "react-dom/client";

import { RouterProvider } from "@stealthscale/provider-router";

import { catalogue } from "#catalogue.ts";
import { routed } from "#routes.ts";

/**
 * The element the application is drawn into.
 */
const root = document.querySelector("#root");

if (root !== null) {
  const router = routed(await catalogue());

  createRoot(root).render(<RouterProvider router={router} />);
}
