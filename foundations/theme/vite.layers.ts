/**
 * Excuses the one file of this package that the build plugin reads through its default export.
 *
 * @remarks
 *   Lint is stated at the workspace root, so the departure is merged in there. The reason is
 *   written here, beside the file it excuses.
 */

import { type Extendable, lint } from "@stealthscale/vite-config";

/**
 * The layers the root merges in on this package's behalf.
 */
export const layers: readonly Extendable[] = [
  lint.defaultExported(["foundations/theme/src/theme.ts"]),
];
