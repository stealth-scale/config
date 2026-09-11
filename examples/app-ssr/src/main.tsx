/**
 * What the browser runs over what the server already drew.
 */

import { hydrateRoot } from "react-dom/client";

import { Summary } from "#summary.tsx";

/**
 * Where the server's markup already is.
 */
const root = document.querySelector("#root");

// Hydrated rather than rendered: the markup is already there, and rendering over it would throw it
// away and draw the same thing again.
if (root !== null) hydrateRoot(root, <Summary subject="totals" />);
