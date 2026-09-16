/**
 * Allows React's `act` in this runtime, and empties the document after every test.
 */

import { afterEach } from "vitest";

declare global {
  /**
   * Whether React accepts `act` in this runtime.
   */
  // eslint-disable-next-line vars-on-top, no-var -- a global declaration cannot use let or const
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  document.body.replaceChildren();
});
