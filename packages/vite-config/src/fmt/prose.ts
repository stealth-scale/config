/**
 * Wrapping prose that is not in code.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Wraps a paragraph of prose at the same width as everything else.
 *
 * Markdown and YAML are left as written by default, because a few renderers treat a line break in
 * prose as a line break on the page. The ones this repository publishes to do not: a Markdown file
 * on GitHub reflows a paragraph however it was typed, so the wrapping is free to be decided here.
 *
 * Deciding it buys two things. Prose in a docblock is already wrapped to this width, so a paragraph
 * reads the same whichever file it is in. And a writing check that prints the offending line prints
 * a line, rather than the whole paragraph it happened to sit in.
 *
 * The cost is real: changing one word reflows the paragraph around it, so a diff shows more than
 * was edited. That is the trade a fixed width always makes, and it is the same one the code takes.
 *
 * @returns The preset.
 */
export function prose(): Preset {
  return preset({ config: { fmt: { proseWrap: "always" } }, name: "fmt.prose" });
}
