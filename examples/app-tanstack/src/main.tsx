/**
 * What the page runs once it has loaded.
 */

import { createRoot } from "react-dom/client";

import { RouterProvider } from "@tanstack/react-router";

import { routed } from "#routes.tsx";
import { watching } from "#stale.ts";

// The other application is deployed on its own schedule, so the chunks a route was told about can
// be gone by the time somebody navigates to it.
watching({
  held: sessionStorage,
  reload: () => {
    globalThis.location.reload();
  },
});

/**
 * Where this application draws.
 */
const root = document.querySelector("#root");

if (root !== null) createRoot(root).render(<RouterProvider router={routed()} />);
