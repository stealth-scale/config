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
 * Reads an `aria-` attribute off a named part.
 *
 * What a component owes a screen reader travels on these — `aria-current="page"`,
 * `aria-expanded="false"`, `aria-describedby` — and they are a contract rather than a detail: a
 * trail that stops marking the page you are on is broken however it looks. Separate from `attr`
 * because that one reads the `data-` a component states about itself, and the two are different
 * promises to different readers.
 *
 * Answers nothing rather than `null` where the attribute is absent, so both readers here fail the
 * same way and a specification never has to remember which.
 *
 * @param container - The rendered output.
 * @param name - The part's name.
 * @param attribute - The attribute, with its `aria-` prefix: `aria-current`.
 * @returns Its value, or nothing where the part carries no such attribute.
 * @throws Error Where nothing in the output carries that part.
 */
export function aria(container: ParentNode, name: string, attribute: string): string | undefined {
  return part(container, name).getAttribute(attribute) ?? undefined;
}

/**
 * Answers whether one part is drawn inside another.
 *
 * Nesting is a thing an anatomy states and a specification should hold it to: an arrow's tip
 * belongs in the arrow, a panel belongs in the positioner that places it. Written here so a
 * specification asserts it through the anatomy rather than through a selector of its own, which is
 * the coupling every reader in this package exists to remove.
 *
 * @param container - The rendered output.
 * @param outer - The part that should hold the other.
 * @param inner - The part that should sit inside it.
 * @returns `true` where the inner part is drawn within the outer one.
 * @throws Error Where nothing in the output carries either part.
 */
export function holds(container: ParentNode, outer: string, inner: string): boolean {
  return part(container, outer).contains(part(container, inner));
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
