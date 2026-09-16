/**
 * Empties the document after every test, so one test never reads markup another one mounted.
 */

import { afterEach } from "vitest";

afterEach(() => {
  document.body.replaceChildren();
});
