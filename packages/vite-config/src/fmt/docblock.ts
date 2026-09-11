/**
 * Laying out a docblock, which is the part of one nobody should be doing by hand.
 */

import { type Preset, preset } from "@stealthscale/config-core";

/**
 * Lays out every docblock the same way.
 *
 * A block always spans several lines, because one collapsed onto a single line stops looking like
 * prose and starts looking like a label — and a label is the thing a docblock is supposed to
 * replace. Every description ends in a full stop, which is the same sentence the linter asks for,
 * decided here so that writing one is not a thing to remember.
 *
 * What is left alone is the wording. A formatter can wrap a line and punctuate a sentence; whether
 * the sentence says anything is `informative-docs`' question, and the linter keeps it.
 *
 * @returns The preset.
 */
export function docblocks(): Preset {
  return preset({
    config: { fmt: { jsdoc: { commentLineStrategy: "multiline", descriptionWithDot: true } } },
    name: "fmt.docblocks",
  });
}
