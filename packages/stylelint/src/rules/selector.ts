/**
 * What a selector may reach for, which decides how a stylesheet can be reused.
 */

/**
 * The refusals that keep a selector reusable.
 *
 * An id is unique to a page, so a rule keyed on one can only ever style one element and cannot be
 * reused where the same thing appears twice. A class qualified by a type — `div.card` — ties the
 * style to the element it was first written against, so moving the class to a `section` silently
 * stops it applying. Both are Google's, and both are about the same thing: a selector that says
 * more than it needs to.
 *
 * Class naming is already checked by the shared set, which asks for the hyphen-separated names
 * Google asks for, so nothing here repeats it.
 */
export const SELECTOR = {
  "selector-max-id": 0,
  "selector-no-qualifying-type": true,
};
