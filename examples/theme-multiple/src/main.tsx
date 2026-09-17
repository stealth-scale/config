/**
 * Starts the application once the browser has loaded the page.
 *
 * @remarks
 *   The stylesheet is imported before the application, so the compiled rules reach the page ahead
 *   of the first paint. The build plugin answers the import with every theme's values and every
 *   recipe the dependency graph publishes.
 */

import { createRoot } from "react-dom/client";

import "@stealthscale/theme/styles.css";

import { App } from "#app.tsx";

/**
 * Selects the element this application renders into, and is null when the page has none.
 */
const root = document.querySelector("#root");

if (root !== null) createRoot(root).render(<App />);
