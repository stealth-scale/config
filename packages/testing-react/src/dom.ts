/**
 * Reading what a part became: the state it reports, and the element it rendered as.
 */

import { part } from "#part.ts";

/**
 * Reads a `data-` attribute off a named part.
 *
 * What a component says about its own state travels on these — `data-state="open"`,
 * `data-shape="circle"`, `data-disabled` — so they are what a specification asserts on rather than
 * a class name, which changes whenever the recipe does.
 *
 * Throws where the part is missing, as `part` does, so an assertion on an absent attribute reads as
 * "no such part" rather than as "undefined is not 'open'".
 *
 * @param container - The rendered output.
 * @param name - The part's name.
 * @param attribute - The attribute, without its `data-` prefix.
 * @returns Its value, or nothing where the part carries no such attribute.
 * @throws Error Where nothing in the output carries that part.
 */
export function attr(container: ParentNode, name: string, attribute: string): string | undefined {
  return part(container, name).dataset[attribute];
}

/**
 * Reads the element a part rendered as, upper-cased.
 *
 * This is the polymorphism a component taking `as` or `asChild` owes: a card asked to be an
 * `article` is an `ARTICLE` in the page outline rather than only in the class list, which is the
 * half of it a screen reader acts on.
 *
 * Upper-cased here rather than left as the document reports it, because the document reports an
 * HTML tag upper-cased and an SVG one as it was written: a mark drawn in SVG would otherwise be
 * the one part whose name a specification has to spell differently.
 *
 * @param container - The rendered output.
 * @param name - The part's name.
 * @returns Its tag name.
 * @throws Error Where nothing in the output carries that part.
 */
export function renderedAs(container: ParentNode, name: string): string {
  return part(container, name).tagName.toUpperCase();
}
