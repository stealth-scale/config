/**
 * Gives the test runner a document for a component to render into.
 */

import { named, type Preset, test } from "@stealthscale/vite-config";

/**
 * The document implementation the runner loads, chosen for its support of media queries.
 */
const DRAWN = "happy-dom";

/**
 * Swaps the runner's environment for one that implements a document.
 *
 * @remarks
 *   A preset replaces the environment a tier set rather than adding to it, so a package needing
 *   another implementation removes this layer by name instead of setting the field again.
 */
export function document(): Preset {
  return named("react.test.document", test.environment(DRAWN));
}
