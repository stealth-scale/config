/**
 * The document a rendering test draws into.
 */

import { named, type Preset, test } from "@stealthscale/vite-config";

/**
 * The implementation the runner draws into.
 *
 * `happy-dom` rather than jsdom because a theme follows the reader's colour-mode preference, which
 * is a media query, and jsdom has never implemented those. The alternative is stubbing `matchMedia`
 * by hand in every repository and hoping each stub keeps resembling the real thing.
 */
const DRAWN = "happy-dom";

/**
 * Gives the runner a document to draw into.
 *
 * Stated beside the tier rather than by it. A specification that mounts a component into no
 * document fails with `document is not defined`, which reads as a broken test rather than as a
 * missing setting, so every package that renders states this whichever tier it extends.
 *
 * A repository testing against something else takes this back by name and states its own.
 *
 * @returns The preset.
 */
export function document(): Preset {
  return named("react.test.document", test.environment(DRAWN));
}
