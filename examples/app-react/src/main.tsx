/**
 * What the page runs once it has loaded.
 */

import { createRoot } from "react-dom/client";

import "#card.css";

import { Badge } from "#badge.tsx";

/**
 * Where the app draws.
 */
const root = document.querySelector("#root");

if (root !== null) createRoot(root).render(<Badge />);
