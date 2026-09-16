/**
 * Locates the elements a component drew, by the part name each one is marked with.
 *
 * @remarks
 *   A marking is the handle a specification holds a component by. The readers here find an element
 *   and hand it back untouched, and every question about what that element says belongs elsewhere.
 */

/**
 * The attribute a component marks each piece of its anatomy with.
 */
const PART = "data-part";

/**
 * An element a component drew, in either HTML or SVG.
 *
 * @remarks
 *   The style member belongs to the type so a reader can ask an element for a custom property. A
 *   count worked out at run time cannot be a class name, so it reaches the stylesheet through the
 *   style attribute and the recipe reads it back from there.
 */
export type Rendered = Element & ElementCSSInlineStyle & HTMLOrSVGElement;

/**
 * Builds the attribute selector that matches one named part.
 */
function selector(name: string): string {
  return `[${PART}="${name}"]`;
}

/**
 * Returns the first element a component marked with a part name.
 *
 * @remarks
 *   A component drawing the same part once per item offers several matches, and the first in
 *   document order is the one that comes back. A caller wanting all of them reads {@link parts}.
 * @throws {@link Error} When nothing under the container carries that part name.
 */
export function part(container: ParentNode, name: string): Rendered {
  const found = container.querySelector<HTMLElement | SVGElement>(selector(name));

  if (found === null) throw new Error(`Nothing in the rendered output carries ${selector(name)}.`);

  return found;
}

/**
 * Lists every element a component marked with a part name, in document order.
 *
 * @remarks
 *   A name no element carries gives back an empty array rather than throwing, so a specification
 *   can assert that a component drew none of a part. The result is a plain array and not a live
 *   NodeList, and a later render leaves it as it was.
 */
export function parts(container: ParentNode, name: string): readonly Rendered[] {
  return [...container.querySelectorAll<HTMLElement | SVGElement>(selector(name))];
}

/**
 * Returns the one element a render put at the top of its container.
 *
 * @remarks
 *   A component under check draws a single root, and reading that root this way asks nothing of
 *   the component's markings. A render producing several top-level elements gives back the first.
 * @throws {@link Error} When the render produced no element at all.
 * @throws {@link Error} When the first element is neither HTML nor SVG, such as a MathML one.
 */
export function only(container: ParentNode): Rendered {
  const found = container.firstElementChild;

  if (found === null) throw new Error("The render produced no element.");

  if (!(found instanceof HTMLElement) && !(found instanceof SVGElement)) {
    throw new Error(
      `The render produced <${found.tagName.toLowerCase()}>, which is neither HTML nor SVG.`,
    );
  }

  return found;
}
