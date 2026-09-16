/**
 * Adds the conditions a recipe reads that the compiler's base preset has no name for, and rewrites
 * the ones whose selector the base preset gets wrong for this vocabulary.
 *
 * @remarks
 *   The base preset already names hover, focus, disabled, open, checked, the breakpoints and the
 *   reading direction, and a recipe uses those as they are. Everything here is either a state the
 *   base preset writes against a class or a raw pseudo-class, or a state this vocabulary defines:
 *   the color mode, the density, a folded screen component, and the pointer.
 */

import { COLOR_MODE_ATTRIBUTE } from "#attributes.ts";
import { type ExtendableConditions } from "#pandacss.ts";

/**
 * Matches an element marked dark.
 */
const DARK = `[${COLOR_MODE_ATTRIBUTE}=dark]`;

/**
 * Lists the three ways a control is marked disabled, which a state it cannot enter excludes.
 */
const DISABLED = ":disabled, [data-disabled], [aria-disabled=true]";

/**
 * Lists the conditions this preset adds to the compiler's.
 *
 * @remarks
 *   `light` is the complement of `dark` rather than a selector on the root, because a selector on
 *   the root matches every element of an unmarked page, a dark subtree included. `hover` sits
 *   inside a media query so a touch device holds no hover after a tap, matches a stamped
 *   `data-hover` so a driven state draws, and excludes a disabled control. `active` excludes a
 *   disabled control and an open trigger, which is pressed and should not be drawn as pressed.
 *   `invalid` waits for `:user-invalid`, which fires after the reader has interacted with the
 *   field rather than on first paint.
 */
export const conditions: ExtendableConditions = {
  extend: {
    /**
     * A pressed control, except a disabled one or an open trigger.
     */
    active: `&:is(:active, [data-active]):not(${DISABLED}, [data-state=open])`,

    /**
     * An element inside a subtree at comfortable density, which is an attribute on any element.
     */
    comfortable: "[data-density=comfortable] &",

    /**
     * An element inside a subtree at compact density.
     */
    compact: "[data-density=compact] &",

    /**
     * An element inside a subtree marked dark, or marked dark itself.
     */
    dark: `${DARK} &`,

    /**
     * A hovered control on a device that can hover, except a disabled one.
     */
    hover: {
      "@media (hover: hover)": {
        [`&:is(:hover, [data-hover]):not(${DISABLED})`]: "@slot",
      },
    },

    /**
     * A field the reader has made invalid, or one stamped invalid by its machine.
     */
    invalid: "&:is(:user-invalid, [data-invalid], [aria-invalid=true])",

    /**
     * An element outside every dark subtree.
     */
    light: `&:not(${DARK}, ${DARK} *)`,

    /**
     * A fine pointer, which is a mouse or a trackpad.
     */
    mouse: "@media (pointer: fine)",

    /**
     * An element inside a screen component that has measured itself narrow and folded.
     */
    narrow: "[data-narrow] &",

    /**
     * A toggle in its off state.
     */
    off: "&[data-state=off]",

    /**
     * A toggle in its on state.
     */
    on: "&[data-state=on]",

    /**
     * A pinned row or column.
     */
    pinned: "&[data-pinned]",

    /**
     * A reader who asked for less transparency, for whom a frosted panel is drawn solid.
     */
    reducedTransparency: "@media (prefers-reduced-transparency: reduce)",

    /**
     * A coarse pointer, which is a finger, for whom a row is drawn touch-sized.
     */
    touch: "@media (pointer: coarse)",
  },
};
