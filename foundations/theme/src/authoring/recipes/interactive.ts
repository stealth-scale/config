/**
 * Writes what every control the reader can press has in common, and what a link has.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Writes the base of a control: the hand, a fast transition of the properties a state changes,
 * no text selection, the disabled look, and the focus ring in the palette's own color.
 *
 * @remarks
 *   The ring is the compiler's `focusVisibleRing` utility drawn outside the box, so a focused
 *   control does not change size, and its color is the palette's `focusRing` role, so a theme
 *   moves it with the palette.
 */
export function interactive(): SystemStyleObject {
  return {
    _disabled: { layerStyle: "disabled" },
    cursor: "button",
    focusRingColor: "colorPalette.focusRing",
    focusVisibleRing: "outside",
    transitionDuration: "fast",
    transitionProperty: "common",
    transitionTimingFunction: "out",
    userSelect: "none",
  };
}

/**
 * Writes the base of a link: the link ink, an underline on hover, the focus ring, and the same
 * ink once visited.
 *
 * @remarks
 *   A visited link keeps the link ink rather than taking the browser's purple, because the
 *   browser's purple is not a color the theme drew and clears no ratio the theme measured.
 */
export function link(): SystemStyleObject {
  return {
    _hover: { textDecoration: "underline", textUnderlineOffset: "normal" },
    _visited: { color: "fg.link" },
    color: "fg.link",
    cursor: "button",
    focusRingColor: "colorPalette.focusRing",
    focusVisibleRing: "outside",
    textDecoration: "none",
  };
}
