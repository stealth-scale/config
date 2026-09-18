/**
 * Starts the application for whoever is reading.
 */

import { createRoot } from "react-dom/client";

import { RouterProvider } from "@stealthscale/provider-router";

import { routed } from "#routes.ts";

/**
 * The element the application is drawn into.
 */
const root = document.querySelector("#root");

if (root !== null) createRoot(root).render(<RouterProvider router={routed()} />);
