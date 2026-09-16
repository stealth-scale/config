/**
 * Finding what a component drew, through the `data-part` its anatomy marks each piece with.
 */

/**
 * The attribute a component marks each piece of its anatomy with.
 *
 * Ark's convention, which Chakra also follows. A root renders `data-part="root"` and a trigger
 * renders `data-part="trigger"`. A specification reads this rather than a class name, which changes
 * with the recipe, or the text, which changes with the copy.
 */
const PART = "data-part";

/**
 * An element a component can have rendered as.
 *
 * Wider than `HTMLElement`, because a mark is drawn in SVG and an SVG element is not one. Both
 * have `dataset`, which is how every reader here finds what it was asked for, and both have
 * `style`, which is how a component passes a runtime value to a custom property its recipe reads.
 * Together they cover everything a component in this design system renders.
 */
export type Rendered = Element & ElementCSSInlineStyle & HTMLOrSVGElement;

/**
 * Returns the selector matching one named part.
 *
 * @param name - The part's name, as its anatomy spells it.
 * @returns An attribute selector matching it.
 */
function selector(name: string): string {
  return `[${PART}="${name}"]`;
}

/**
 * Finds the one piece of a component's anatomy a specification is asking about.
 *
 * It throws rather than returning nothing, so a specification needs neither a non-null assertion
 * nor a guard at every call site. The error names the part, so a failure reports "no such part"
 * rather than "undefined is not 'circle'".
 *
 * @param container - The rendered output.
 * @param name - Which piece of the anatomy to find.
 * @returns The element marked with that part.
 * @throws Error When no element in the output has that part.
 */
export function part(container: ParentNode, name: string): Rendered {
  const found = container.querySelector<HTMLElement | SVGElement>(selector(name));

  if (found === null) throw new Error(`Nothing in the rendered output carries ${selector(name)}.`);

  return found;
}

/**
 * Finds every piece of a component's anatomy under one name.
 *
 * For the parts a component repeats, such as an item, a marker or a handle, where the assertion is
 * about the set rather than any one of them. It returns an array rather than the `NodeList` the
 * document returns, so a specification can map over it without spreading first.
 *
 * An empty array is a result here rather than a failure, because a specification asserts that a
 * component rendered none.
 *
 * @param container - The rendered output.
 * @param name - The part's name.
 * @returns Each element marked with that part, in document order.
 */
export function parts(container: ParentNode, name: string): readonly Rendered[] {
  return [...container.querySelectorAll<HTMLElement | SVGElement>(selector(name))];
}

/**
 * Returns the one element a render produced.
 *
 * A specification calls this after rendering a single component. Reading `firstElementChild`
 * instead is typed as nullable, so it needs a non-null assertion for a value the specification has
 * just caused to exist.
 *
 * @param container - The rendered output.
 * @returns Its first element.
 * @throws Error When the render produced no element, or produced one that is neither HTML nor
 * SVG.
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
