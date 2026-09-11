/**
 * What a package the browser runs may not do to the document.
 */

import { type Rules } from "#lint/rules/rules.ts";

/**
 * Says the same thing wherever markup is assigned rather than built.
 */
const PARSED =
  "Assigning markup parses it. Build the element, or sanitise it where that is the job.";

/**
 * The refusals that only mean anything in a browser.
 *
 * Assigning a string to one of these parses it, which is the shortest path from a value to an XSS
 * hole. A package whose job is to render untrusted text sanitises first and argues for the
 * exception in its own override.
 *
 * Nothing here names a framework. A rule about React belongs to the package that configures React,
 * because this one cannot depend on it without making every later config package impossible to
 * add.
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
