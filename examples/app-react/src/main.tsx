/**
 * Starts the application once the browser has loaded the page.
 *
 * @remarks
 *   The stylesheet is imported for its side effect and before the component, so the build emits it
 *   ahead of anything the component pulls in and the first paint carries it.
 */

import { createRoot } from "react-dom/client";

import "#card.css";

import Notes from "#notes.mdx";

/**
 * Selects the element this application renders into, and is null when the page has none.
 */
const root = document.querySelector("#root");

if (root !== null) createRoot(root).render(<Notes />);
