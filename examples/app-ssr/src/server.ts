/**
 * Joins the application's markup into the page the build produced.
 */

import { createElement } from "react";
import { renderToString } from "react-dom/server";

import { Summary } from "#summary.tsx";

/**
 * The comment an index page carries where the application's markup belongs.
 */
const SLOT = "<!--app-->";

/**
 * Puts the application's markup in place of the slot a page holds for it.
 *
 * @remarks
 *   A page with no slot in it comes back unchanged, so a build that dropped the comment serves an
 *   empty shell and reports nothing.
 * @param page - The built index page, holding the slot once.
 * @param subject - Named in the rendered summary and read nowhere else.
 * @returns The page with the markup where the slot stood.
 */
export function rendered(page: string, subject: string): string {
  return page.replace(SLOT, renderToString(createElement(Summary, { subject })));
}
