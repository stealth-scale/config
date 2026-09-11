/**
 * What a server runs to turn the application into text.
 */

import { createElement } from "react";
import { renderToString } from "react-dom/server";

import { Summary } from "#summary.tsx";

/**
 * What the page leaves for the rendered application to replace.
 */
const SLOT = "<!--app-->";

/**
 * Renders the application into the page a build produced.
 *
 * The one entry a server build has. Everything it reaches is compiled into that build rather than
 * imported at run time, which is what `ssr.bundled` is for: the component library imports a
 * stylesheet, and node reaching an untransformed `import "./panel.css"` throws.
 *
 * @param page - The built page, as text.
 * @param subject - The thing to report on.
 * @returns The page with the application drawn into it.
 */
export function rendered(page: string, subject: string): string {
  return page.replace(SLOT, renderToString(createElement(Summary, { subject })));
}
