/**
 * What a host calls to put this application on its page.
 */

import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";

import { Dashboard } from "#dashboard.tsx";

/**
 * Draws this application into an element the host owns.
 *
 * The one function a host needs and the reason this application is built with an absolute base: the
 * host loads this module, hands it somewhere to draw, and everything after that — the chunks, the
 * stylesheet — is fetched from where this application says it lives rather than from the host.
 *
 * Answers the root rather than nothing, because the host is what decides when this application
 * stops, and it cannot unmount something it was never handed.
 *
 * @param into - The element to draw into, which the host owns and keeps.
 * @param count - The number to report.
 * @returns The root, for the host to unmount when it takes the application off the page.
 */
export function mount(into: Element, count: number): Root {
  const root = createRoot(into);

  root.render(createElement(Dashboard, { count }));

  return root;
}
