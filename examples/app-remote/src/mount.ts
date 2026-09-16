/**
 * Offers the one function a host calls to put this application on its page.
 */

import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";

import { Dashboard } from "#dashboard.tsx";

/**
 * Takes over an element the host owns and draws this application inside it.
 *
 * @remarks
 *   Everything the first render pulls in afterwards, the chunks and the stylesheet, is fetched
 *   from where this application is deployed rather than from the host's origin. The element is
 *   emptied on the first render, so a host that passes one holding its own markup loses it.
 * @param into - The element to draw into. The host keeps it and decides how long it lives.
 * @param count - How many items to report.
 * @returns The root, which the host unmounts when it takes this application off the page.
 */
export function mount(into: Element, count: number): Root {
  const root = createRoot(into);

  root.render(createElement(Dashboard, { count }));

  return root;
}
