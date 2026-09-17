/**
 * Reads what a rendered component did with its recipe.
 *
 * @remarks
 *   A bound component marks the element carrying its recipe with `data-recipe`, and an anatomy
 *   marks each part of a compound component with `data-part`. Those are the handles a
 *   specification holds, because a class list changes with the recipe. Every reader throws where
 *   the element it was asked for is absent, naming it, so a failure says which element went
 *   missing.
 */

/**
 * Fixes the attribute a bound component marks the element carrying its recipe with.
 */
const RECIPE = "data-recipe";

/**
 * Fixes the attribute an anatomy marks each part of a compound component with.
 */
const PART = "data-part";

/**
 * Writes a slot's name the way an anatomy writes a part's, so `itemIndicator` finds the part
 * stamped `item-indicator`.
 */
function partOf(slot: string): string {
  return slot
    .replaceAll(/([A-Z])([A-Z])/gu, "$1-$2")
    .replaceAll(/([a-z])([A-Z])/gu, "$1-$2")
    .replaceAll(/[\s_]+/gu, "-")
    .toLowerCase();
}

/**
 * Finds one element by an attribute and its value.
 *
 * @throws {@link Error} When nothing in the output carries the attribute with that value.
 */
function one(container: ParentNode, attribute: string, value: string): HTMLElement {
  const selector = `[${attribute}="${value}"]`;
  const found = container.querySelector<HTMLElement>(selector);

  if (found === null) throw new Error(`Nothing in the rendered output carries ${selector}.`);

  return found;
}

/**
 * Finds the element a recipe was applied to, by the class name the binding stamps as
 * `data-recipe`.
 *
 * @throws {@link Error} When nothing in the output carries that recipe.
 */
export function recipeElement(container: ParentNode, name: string): HTMLElement {
  return one(container, RECIPE, name);
}

/**
 * Finds the element one slot of a compound component was applied to, by the part its anatomy
 * stamps.
 *
 * @throws {@link Error} When nothing in the output carries that part.
 */
export function slotElement(container: ParentNode, slot: string): HTMLElement {
  return one(container, PART, partOf(slot));
}

/**
 * Lists every class an element carries, sorted, so a comparison does not depend on the order the
 * compiler emitted them in.
 */
export function classesOf(element: Element): readonly string[] {
  return [...element.classList].toSorted();
}

/**
 * Lists every class the element carrying a recipe was given, sorted.
 *
 * @throws {@link Error} When nothing in the output carries that recipe.
 */
export function recipeClasses(container: ParentNode, name: string): readonly string[] {
  return classesOf(recipeElement(container, name));
}

/**
 * Lists every class one slot of a compound component was given, sorted.
 *
 * @throws {@link Error} When nothing in the output carries that part.
 */
export function slotClasses(container: ParentNode, slot: string): readonly string[] {
  return classesOf(slotElement(container, slot));
}
