/**
 * Writes the base of a form field: its surface, its edge, its ink, and the states a field enters.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Writes the base of a field.
 *
 * @remarks
 *   The placeholder reads the muted ink, which clears the text ratio, because a placeholder is
 *   text under WCAG. An invalid field draws its edge and its ring in the error palette, and a
 *   read-only field sits on the subtle surface so a reader can tell it from one that takes input.
 *   A coarse pointer raises the field to the middle control height rather than growing a target
 *   around it, because a field is a replaced element and no pseudo-element renders on one. The
 *   transition matches the one every pressed control carries, so a field and a button in one row
 *   settle together.
 */
export function field(): SystemStyleObject {
  return {
    _disabled: { layerStyle: "disabled" },
    _hover: { borderColor: "border.emphasized" },
    _invalid: { borderColor: "border.error", focusRingColor: "error.focusRing" },
    _placeholder: { color: "fg.muted" },
    _readOnly: { background: "bg.subtle" },
    _touch: { minBlockSize: "control.md" },
    background: "bg.panel",
    borderColor: "border",
    borderWidth: "sm",
    color: "fg",
    focusRingColor: "colorPalette.focusRing",
    focusVisibleRing: "inside",
    transitionDuration: "fast",
    transitionProperty: "common",
    transitionTimingFunction: "out",
  };
}
