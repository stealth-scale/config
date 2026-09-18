/**
 * Starts the routed application in the browser.
 *
 * @remarks
 *   The reload watch is set up before the router exists, because a route the visitor reaches first
 *   can be the one whose chunk has gone. A document without the root element is served as the
 *   build wrote it and no route is ever matched.
 */

import { createRoot } from "react-dom/client";

import { RouterProvider } from "@tanstack/react-router";

import { routed } from "#routes.ts";
import { watching } from "#stale.ts";

watching({
  held: sessionStorage,
  reload: () => {
    globalThis.location.reload();
  },
});

/**
 * The element the application is drawn into.
 */
const root = document.querySelector("#root");

if (root !== null) createRoot(root).render(<RouterProvider router={routed()} />);
