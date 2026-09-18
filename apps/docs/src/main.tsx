/**
 * Starts the catalogue once the browser has loaded the page.
 *
 * @remarks
 *   The stylesheet is imported before the catalogue, so the compiled rules reach the page ahead of
 *   the first paint. The build plugin answers the import with every theme in `theme.config.ts` and
 *   every recipe the dependency graph publishes.
 */

import { createRoot } from "react-dom/client";

import "@stealthscale/theme/styles.css";

import { Catalogue } from "#catalogue.tsx";

/**
 * Selects the element this application renders into, and is null when the page has none.
 */
const root = document.querySelector("#root");

if (root !== null) createRoot(root).render(<Catalogue />);
