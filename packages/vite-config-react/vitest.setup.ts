/**
 * Allows React's `act` in this runtime, unmounts what a test rendered, and empties the document
 * after every test.
 *
 * @remarks
 *   A mounted root keeps its effects until it is unmounted, so emptying the document alone leaves
 *   a scroll lock or a listener from one test running under the next. Testing Library unmounts the
 *   roots it rendered, and the document is emptied afterwards for anything a test appended by hand.
 */

import { cleanup } from "@testing-library/react";
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
  cleanup();
  document.body.replaceChildren();
});
