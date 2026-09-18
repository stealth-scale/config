/**
 * Reads what the other deployment declares, then starts this application over both.
 *
 * @remarks
 *   The reload watch is set up before the router exists, because a page the visitor reaches first
 *   can be the one whose chunk has gone. A document without the root element is served as the build
 *   wrote it and no page is ever matched.
 */

import { createRoot } from "react-dom/client";

import { RouterProvider } from "@stealthscale/provider-router";

import { declarations } from "#declarations.ts";
import { routed } from "#routes.ts";
import { watching } from "#stale.ts";

watching({
  reload: () => {
    globalThis.location.reload();
  },
  store: sessionStorage,
});

/**
 * The element the application is drawn into.
 */
const root = document.querySelector("#root");

if (root !== null) {
  const router = routed(await declarations());

  createRoot(root).render(<RouterProvider router={router} />);
}
