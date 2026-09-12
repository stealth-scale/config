/**
 * The measurements every file is written to.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Writes every file to the same measurements.
 *
 * Each of these is already the formatter's own answer, and each is stated anyway. Two reasons. A
 * default that changes upstream would reformat every file in every repository at once, which is a
 * thing to decide rather than to receive. And these six are the ones an editor also has an opinion
 * about, so they are written a second time in `.editorconfig` — where the formatter reads them but
 * lets these win — and two places that disagree is worse than either being wrong.
 *
 * A docblock that already fits is left as it was written. The formatter rewraps one greedily on its
 * own, which fights the linter: `check-line-alignment` asks for a two-space wrap indent, and a
 * rewrap drops it wherever the description runs over by a single word. Nothing can then satisfy
 * both, and `vp fmt` and `vp check` undo each other. Wrapping still happens where a line is too
 * long, so the width is enforced either way.
 *
 * @returns The preset.
 */
export function style(): Preset {
  return preset({
    config: {
      fmt: {
        endOfLine: "lf",
        insertFinalNewline: true,
        jsdoc: { lineWrappingStyle: "balance" },
        printWidth: 100,
        singleQuote: false,
        tabWidth: 2,
        useTabs: false,
      },
    },
    name: "fmt.style",
  });
}
