/**
 * Excuses one file of this package from the coverage the workspace root
 * measures.
 *
 * @remarks
 *   Coverage is measured once across the whole workspace, so a file left out of
 *   it has to be named at the root. The glob is written from the root and the
 *   reason is written here, beside the code it excuses.
 */

import { type Extendable, test } from "@stealthscale/vite-config";

/**
 * The layers the root merges in on this package's behalf.
 */
export const layers: readonly Extendable[] = [
  test.omit({
    because:
      "the JSX runtime marks every element call `@__PURE__`, which tells a bundler it may drop " +
      "the call where nothing reads its result. Coverage reads that as a path, and it is one no " +
      "test can take: either the component rendered or it was never rendered at all. A component " +
      "whose root element has more than one child reports one such branch",
    files: ["examples/lib-ui/src/panel.tsx"],
  }),
];
