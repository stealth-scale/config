/**
 * Writes the `size` axis of a recipe from the semantic scales, so a theme that moves the scales
 * moves every control.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";
import { recordOf } from "#record.ts";
import { type Scale } from "#scales/geometry.ts";

/**
 * Writes the `size` axis of a control: its height, its inset, its gap and its label, each a step
 * of the semantic scale of the same name.
 *
 * @typeParam Offered - The sizes the recipe offers.
 */
export function controlSizes<const Offered extends Scale>(
  sizes: readonly Offered[],
): Record<Offered, SystemStyleObject> {
  return recordOf(sizes, (size) => ({
    gap: `gap.${size}`,
    height: `control.${size}`,
    paddingInline: `inset.${size}`,
    textStyle: `label.${size}`,
  }));
}

/**
 * Writes the `size` axis of an icon: a square box on the icon scale.
 *
 * @typeParam Offered - The sizes the recipe offers.
 */
export function iconSizes<const Offered extends Scale>(
  sizes: readonly Offered[],
): Record<Offered, SystemStyleObject> {
  return recordOf(sizes, (size) => ({ boxSize: `icon.${size}` }));
}

/**
 * Writes the `size` axis of a square control that holds one icon and no label: a box on the
 * control scale with no inset.
 *
 * @typeParam Offered - The sizes the recipe offers.
 */
export function iconOnly<const Offered extends Scale>(
  sizes: readonly Offered[],
): Record<Offered, SystemStyleObject> {
  return recordOf(sizes, (size) => ({ boxSize: `control.${size}`, padding: "0" }));
}

/**
 * Widens the hit area of a control to a medium control's box under a coarse pointer, without
 * moving the visible box.
 *
 * @remarks
 *   The area is a pseudo-element centred on the control, which a pointer hits as part of it. The
 *   control is positioned under the coarse pointer alone, so a control that positions itself is
 *   left alone everywhere else.
 */
export function touchTarget(): SystemStyleObject {
  return {
    _touch: {
      _after: {
        content: '""',
        insetBlockStart: "50%",
        insetInlineStart: "50%",
        minBlockSize: "control.md",
        minInlineSize: "control.md",
        position: "absolute",
        translate: "-50% -50%",
      },
      position: "relative",
    },
  };
}
