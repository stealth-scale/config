/**
 * Starts the browser half of the application on markup a server has already sent.
 *
 * @remarks
 *   The tree is hydrated rather than rendered, because rendering over the server's markup discards
 *   it and draws the same thing a second time. A document without the root element is left as the
 *   server wrote it, and nothing in the page becomes interactive.
 */

import { hydrateRoot } from "react-dom/client";

import { Summary } from "#summary.tsx";

/**
 * The element the server rendered the application into.
 */
const root = document.querySelector("#root");

if (root !== null) hydrateRoot(root, <Summary subject="totals" />);
