/**
 * Starts the application once the browser has loaded the page.
 */

import { createRoot } from "react-dom/client";

import "#styles.css";

import { App } from "#app.tsx";

/**
 * Selects the element this application renders into, and is null when the page has none.
 */
const root = document.querySelector("#root");

if (root !== null) createRoot(root).render(<App />);
