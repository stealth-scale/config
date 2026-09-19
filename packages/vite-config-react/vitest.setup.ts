/**
 * Allows React's `act` in this runtime, fails a test that renders outside it, unmounts what a test
 * rendered, and empties the document after every test.
 *
 * @remarks
 *   A mounted root keeps its effects until it is unmounted, so emptying the document alone leaves
 *   a scroll lock or a listener from one test running under the next. Testing Library unmounts the
 *   roots it rendered, and the document is emptied afterwards for anything a test appended by hand.
 *   React reports an update made outside `act` on `console.error`, which a passing run writes to
 *   stderr and no gate reads. A test that renders a component built on a state machine and asserts
 *   before the machine settles is reading a half-drawn tree, so the warning is turned into a
 *   failure. Only that one warning is caught: a specification that drives a component into throwing
 *   makes React report the throw the same way, and that is a case rather than a fault.
 */

import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

declare global {
  /**
   * Whether React accepts `act` in this runtime.
   */
  // eslint-disable-next-line vars-on-top, no-var -- a global declaration cannot use let or const
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

/**
 * The message React writes when a test updates a component outside `act`.
 */
const OUTSIDE_ACT = "not wrapped in act(";

/**
 * The components the test under way updated outside `act`.
 */
const outside: string[] = [];

/**
 * Reports whether what React wrote names an update made outside `act`.
 */
function reports(args: readonly unknown[]): boolean {
  return args.some((each) => typeof each === "string" && each.includes(OUTSIDE_ACT));
}

/**
 * Reads the component React named, which it passes beside the message rather than inside it.
 */
function named(args: readonly unknown[]): string {
  const component = args[1];

  return typeof component === "string" ? component : "a component";
}

beforeEach(() => {
  outside.length = 0;

  const wrote = console.error.bind(console);

  vi.spyOn(console, "error").mockImplementation((...args: readonly unknown[]) => {
    if (reports(args)) outside.push(named(args));

    wrote(...args);
  });
});

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
  vi.restoreAllMocks();

  if (outside.length === 0) return;

  throw new Error(
    `${[...new Set(outside)].join(", ")} updated outside act(). Render a component built on a ` +
      "state machine with drawn(), which settles before it returns.",
  );
});
