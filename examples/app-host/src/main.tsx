/**
 * What the page runs once it has loaded.
 */

import { createRoot } from "react-dom/client";

import { Shell } from "#shell.tsx";

/**
 * Where the host draws.
 */
const root = document.querySelector("#root");

if (root !== null) createRoot(root).render(<Shell />);
