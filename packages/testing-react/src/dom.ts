/**
 * Reading what a part became: the state it reports, and the element it rendered as.
 */

import { part } from "#part.ts";

/**
 * Reads a `data-` attribute off a named part.
 *
 * A component reports its own state through these attributes, such as `data-state="open"`,
 * `data-shape="circle"` and `data-disabled`. A specification asserts on them rather than on a class
 * name, which changes whenever the recipe does.
 *
 * It throws when the part is missing, as `part` does, so an assertion on an absent attribute
 * reports "no such part" rather than "undefined is not 'open'".
 *
 * @param container - The rendered output.
 * @param name - The part's name.
 * @param attribute - The attribute, without its `data-` prefix.
 * @returns Its value, or nothing when the part has no such attribute.
 * @throws Error When no element in the output has that part.
 */
export function attr(container: ParentNode, name: string, attribute: string): string | undefined {
  return part(container, name).dataset[attribute];
}

/**
 * Reads an `aria-` attribute off a named part.
 *
 * A component exposes its screen reader contract through these attributes, such as
 * `aria-current="page"`, `aria-expanded="false"` and `aria-describedby`. A breadcrumb that stops
 * marking the current page is broken however it looks.
 *
 * Separate from `attr` because that one reads the `data-` attributes a component sets about itself,
 * and the two address different readers. This returns `undefined` rather than `null` for an absent
 * attribute, so both readers here behave the same way.
 *
 * @param container - The rendered output.
 * @param name - The part's name.
 * @param attribute - The attribute, with its `aria-` prefix: `aria-current`.
 * @returns Its value, or nothing when the part has no such attribute.
 * @throws Error When no element in the output has that part.
 */
export function aria(container: ParentNode, name: string, attribute: string): string | undefined {
  return part(container, name).getAttribute(attribute) ?? undefined;
}

/**
 * Reports whether one part is drawn inside another.
 *
 * An anatomy declares its nesting, and a specification asserts it. An arrow's tip belongs inside
 * the arrow, and a panel belongs inside the positioner that places it. Asserting through the
 * anatomy rather than through a selector of its own is what every reader in this package is for.
 *
 * @param container - The rendered output.
 * @param outer - The part that should hold the other.
 * @param inner - The part that should sit inside it.
 * @returns `true` when the inner part is drawn within the outer one.
 * @throws Error When no element in the output has either part.
 */
export function holds(container: ParentNode, outer: string, inner: string): boolean {
  return part(container, outer).contains(part(container, inner));
}

/**
 * Reads the element a part rendered as, upper-cased.
 *
 * A component taking `as` or `asChild` changes the element it renders. A card asked to be an
 * `article` appears as an `ARTICLE` in the page outline, which is the part a screen reader acts on.
 *
 * The name is upper-cased here because the document reports an HTML tag upper-cased and an SVG tag
 * as it was written. Without this, a mark drawn in SVG would be the one part a specification has to
 * spell differently.
 *
 * @param container - The rendered output.
 * @param name - The part's name.
 * @returns Its tag name.
 * @throws Error When no element in the output has that part.
 */
export function renderedAs(container: ParentNode, name: string): string {
  return part(container, name).tagName.toUpperCase();
}
