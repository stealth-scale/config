/**
 * Starts the routed application in the browser.
 */

import { createRoot } from "react-dom/client";

import { RouterProvider } from "@tanstack/react-router";

import { routed } from "#routes.ts";

/**
 * The element the application is drawn into.
 */
const root = document.querySelector("#root");

if (root !== null) createRoot(root).render(<RouterProvider router={routed()} />);
