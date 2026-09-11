/**
 * What the page runs once it has loaded.
 */

import { createRoot } from "react-dom/client";

import { RouterProvider } from "@tanstack/react-router";

import { routed } from "#routes.tsx";

/**
 * Where this application draws.
 */
const root = document.querySelector("#root");

if (root !== null) createRoot(root).render(<RouterProvider router={routed()} />);
