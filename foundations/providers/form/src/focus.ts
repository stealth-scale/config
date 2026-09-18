/**
 * Moves focus where a form needs it: to a control by its name, into an element by its id, and to
 * the first refused field or the form's own errors after a refused submit.
 */

/**
 * Matches the elements a person can move focus to inside a form: every control and every element
 * given a tabindex, a hidden input left out.
 */
const FOCUSABLE = "input:not([type=hidden]), select, textarea, button, [tabindex]";

/**
 * Describes the state of one field a refused submit is read for.
 */
interface FieldErrors {
  /**
   * The errors the field shows, from every slot.
   */
  readonly errors: readonly unknown[];
}

/**
 * Describes what a form whose submit was refused is read for: the fields and their errors.
 *
 * @remarks
 *   The values are left out on purpose. A shape naming them would hand the library a candidate
 *   for the form's values type when the defaults are spread into its options, and that candidate
 *   would be `unknown`. Every form the library builds satisfies this shape.
 */
export interface Invalidated {
  /**
   * The identifier the form's element carries, where the form component writes it, so a control
   * is found inside this form rather than the first on the page.
   */
  readonly formId?: string | undefined;

  /**
   * The state as it is now, as far as the fields go.
   */
  readonly state: {
    /**
     * The state of every field the form has met, by path.
     */
    readonly fieldMeta: Readonly<Partial<Record<string, FieldErrors>>>;
  };
}

/**
 * Writes the id the errors region of a form carries, from the form's own identifier.
 */
export function errorsId(formId: string): string {
  return `${formId}-errors`;
}

/**
 * Finds the element carrying an id, or nothing.
 *
 * @remarks
 *   An attribute selector rather than an id selector, because an id React writes opens with a
 *   colon and a digit, which an id selector refuses even escaped in one document implementation.
 */
function byId(id: string): Element | null {
  return document.querySelector(`[id="${CSS.escape(id)}"]`);
}

/**
 * Opens every closed disclosure around an element, so a control inside a closed group is shown
 * before focus moves to it.
 *
 * @remarks
 *   The content of a closed `details` element is not rendered, and an element that is not
 *   rendered is not focusable, so focusing a refused field inside one does nothing without this.
 */
function reveal(element: Element): void {
  for (
    let details = element.closest("details");
    details !== null;
    details = details.parentElement?.closest("details") ?? null
  ) {
    details.open = true;
  }
}

/**
 * Moves focus to an element, opening whatever closes it in first.
 *
 * @returns Whether the element was there to focus.
 */
function moveTo(element: Element | null): boolean {
  if (!(element instanceof HTMLElement)) return false;

  reveal(element);
  element.focus();

  return true;
}

/**
 * Moves focus to the control bound to a field.
 *
 * @remarks
 *   The control is found by the `name` attribute the bound field writes, which is the field's
 *   path, inside the element carrying the form's identifier where one is given and it is on the
 *   page, and anywhere on the page otherwise. Nothing happens where no control carries the name.
 * @param name - The field's path, as the bound field writes it.
 * @param formId - The identifier of the form's element, which the form component writes as its
 *   `id`, so two forms on one page naming the same field each focus their own control.
 * @returns Whether a control carrying the name was there to focus.
 */
export function focusControl(name: string, formId?: string): boolean {
  const control = `[name="${CSS.escape(name)}"]`;
  const inside = formId === undefined ? null : byId(formId);

  return moveTo(inside?.querySelector(control) ?? document.querySelector(control));
}

/**
 * Moves focus into the element carrying an id: to the first control inside it, or to the element
 * itself where it holds no control and can take focus.
 *
 * @remarks
 *   This is how a step, an item of a repeat group and the errors region take focus, each through
 *   the id the foundation gives its layout and the layout writes on its root element.
 * @returns Whether anything was there to focus.
 */
export function focusInside(id: string): boolean {
  const element = byId(id);

  if (element === null) return false;

  return moveTo(element.querySelector(FOCUSABLE) ?? element);
}

/**
 * Moves focus to the first field with an error whose control is on the page, in the order the
 * form met its fields, or to the form's errors region where no such field exists.
 *
 * @remarks
 *   A submit that fails without moving focus leaves a keyboard or screen reader user with no way
 *   to find the problem. An issue at the root of the schema belongs to no control, so the errors
 *   region `Fields` draws takes focus instead, found by the form's identifier.
 */
export function focusFirstInvalid(form: Invalidated): void {
  const refused = Object.entries(form.state.fieldMeta)
    .filter(([, meta]) => meta !== undefined && meta.errors.length > 0)
    .map(([name]) => name);

  if (refused.some((name) => focusControl(name, form.formId))) return;

  if (form.formId !== undefined) focusInside(errorsId(form.formId));
}
