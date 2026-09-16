/**
 * The width, indent, quote and line ending every file is written to.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Settles the whitespace and quoting questions nobody should argue about.
 *
 * @remarks
 *   The same values are stated again in the repository's editorconfig, so an
 *   editor writes what the formatter would write and neither one reformats the
 *   other's output.
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
