/**
 * Finding what a component drew, through the `data-part` its anatomy marks each piece with.
 */

/**
 * The attribute a component marks each piece of its anatomy with.
 *
 * Ark's convention, which Chakra carries: a root renders `data-part="root"`, a trigger renders
 * `data-part="trigger"`. It is the one handle a specification has that survives restyling, since a
 * class name changes with the recipe and the text changes with the copy.
 */
const PART = "data-part";

/**
 * Answers the selector matching one named part.
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
 * Throws rather than answering nothing, so a specification needs neither an assertion the linter
 * refuses nor a guard at every call site. What it throws names the part, which is the difference
 * between reading "no such part" and reading "undefined is not 'circle'".
 *
 * @param container - The rendered output.
 * @param name - Which piece of the anatomy to find.
 * @returns The element carrying it.
 * @throws Error Where nothing in the output carries that part.
 */
export function part(container: ParentNode, name: string): HTMLElement {
  const found = container.querySelector<HTMLElement>(selector(name));

  if (found === null) throw new Error(`Nothing in the rendered output carries ${selector(name)}.`);

  return found;
}

/**
 * Finds every piece of a component's anatomy under one name.
 *
 * For the parts a component repeats — an item, a marker, a handle — where what is being asserted is
 * the set rather than any one of them. Answers a list rather than the collection the document hands
 * back, so a specification can map over it without spreading first.
 *
 * Empty is an answer here rather than a failure: "it drew none" is a thing a specification says.
 *
 * @param container - The rendered output.
 * @param name - The part's name.
 * @returns Each element carrying it, in the order the document holds them.
 */
export function parts(container: ParentNode, name: string): readonly HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(selector(name))];
}

/**
 * Answers the one element a render produced.
 *
 * What a specification wants after rendering a single component and asking what became of it. The
 * alternative is reading `firstElementChild`, which is typed as nullable and so needs an assertion
 * the linter refuses — for a value the specification has just caused to exist.
 *
 * @param container - The rendered output.
 * @returns Its first element.
 * @throws Error Where the render produced no element, or produced one the document does not count
 *   as HTML.
 */
export function only(container: ParentNode): HTMLElement {
  const found = container.firstElementChild;

  if (found === null) throw new Error("The render produced no element.");

  if (!(found instanceof HTMLElement)) {
    throw new Error(`The render produced <${found.tagName.toLowerCase()}>, which is not HTML.`);
  }

  return found;
}
