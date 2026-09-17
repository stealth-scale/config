/**
 * Adds the conditions a recipe switches on beyond the compiler's own: the color mode, the pointer,
 * the density, the folded screen, a toggle's states and the reader's preferences.
 *
 * @remarks
 *   The color mode is an attribute, like the theme, so a subtree can be switched on its own. Where
 *   no attribute is written the operating system's preference decides, so a page that writes
 *   nothing follows the reader's setting and a page that writes the attribute overrides it. Each
 *   mode is two blocks: the attribute on an ancestor, or the preference outside a subtree that
 *   states the other mode. The attribute block names an ancestor and not the element itself, as
 *   the compiler's theme attribute does, because the compiler writes the same selector round a
 *   token block, and a block that matched every element below the carrier would let a mode
 *   nested inside the other one be decided by stylesheet order rather than by the nearest
 *   carrier.
 */

import { COLOR_MODE_ATTRIBUTE } from "#attributes.ts";
import { type ExtendableConditions } from "#pandacss.ts";

/**
 * Selects an element inside a subtree switched to dark mode.
 */
const DARK = `[${COLOR_MODE_ATTRIBUTE}=dark]`;

/**
 * Selects an element inside a subtree switched to light mode.
 */
const LIGHT = `[${COLOR_MODE_ATTRIBUTE}=light]`;

/**
 * Lists the states a control does not react in.
 */
const DISABLED = ":disabled, [data-disabled], [aria-disabled=true]";

/**
 * Describes a condition written as blocks rather than as one selector.
 */
type Block = Exclude<NonNullable<ExtendableConditions["extend"]>[string], string>;

/**
 * Writes a mode as its two blocks: the attribute above, or the preference outside the other mode.
 */
function mode(own: string, other: string, scheme: "dark" | "light"): Block {
  return {
    [`@media (prefers-color-scheme: ${scheme})`]: { [`&:not(${other}, ${other} *)`]: "@slot" },
    [`${own} &`]: "@slot",
  };
}

/**
 * Lists the conditions the foundation adds to the compiler's.
 */
export const conditions: ExtendableConditions = {
  extend: {
    active: `&:is(:active, [data-active]):not(${DISABLED}, [data-state=open])`,

    comfortable: "[data-density=comfortable] &",

    compact: "[data-density=compact] &",

    dark: mode(DARK, LIGHT, "dark"),

    hover: {
      "@media (hover: hover)": {
        [`&:is(:hover, [data-hover]):not(${DISABLED})`]: "@slot",
      },
    },

    invalid: "&:is(:user-invalid, [data-invalid], [aria-invalid=true])",

    light: mode(LIGHT, DARK, "light"),

    mouse: "@media (pointer: fine)",

    narrow: "[data-narrow] &",

    off: "&[data-state=off]",

    on: "&[data-state=on]",

    pinned: "&[data-pinned]",

    reducedTransparency: "@media (prefers-reduced-transparency: reduce)",

    touch: "@media (pointer: coarse)",
  },
};
