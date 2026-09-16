/**
 * The shape the formatter writes a doc comment in.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Spreads a doc comment over several lines and ends each description with a
 * full stop.
 *
 * @remarks
 *   The lint rules refuse a single-line block and check the wrap at a fixed
 *   indent. This makes the formatter produce the form those rules accept, so a
 *   block is never rewritten into something the linter then rejects.
 */
export function docblocks(): Preset {
  return preset({
    config: { fmt: { jsdoc: { commentLineStrategy: "multiline", descriptionWithDot: true } } },
    name: "fmt.docblocks",
  });
}
