/**
 * Refuses the browser APIs that turn a string into markup or into a session.
 *
 * @remarks
 *   No rule here names a framework. A package rendering through React and a
 *   package touching the DOM directly are held to the same list, so the group
 *   survives a change of framework untouched.
 */

import { type Rules } from "#lint/rules/rules.ts";

/**
 * The reason given for refusing the two properties that parse what is assigned.
 */
const PARSED =
  "Assigning markup parses it. Build the element, or sanitise it where that is the job.";

/**
 * Refuses each route a string takes to the parser, and the document cookie.
 *
 * @remarks
 *   The cookie entry names `document` as its object, so a field called `cookie`
 *   on anything else is left alone. Every entry carries a message, because a
 *   refusal offering no reason gets worked around instead of understood.
 */
export const MARKUP: Rules = {
  "no-restricted-properties": [
    "error",
    { message: PARSED, property: "innerHTML" },
    { message: PARSED, property: "outerHTML" },
    {
      message: "Parses whatever it is given. Build the element instead.",
      property: "insertAdjacentHTML",
    },
    {
      message: "Cookies are the session. Go through the package that owns authentication.",
      object: "document",
      property: "cookie",
    },
  ],
  "unicorn/no-document-cookie": "error",
};
