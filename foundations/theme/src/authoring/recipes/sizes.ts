/**
 * Writes the `size` axis of a recipe from the semantic scales, so a theme that moves the scales
 * moves every control.
 *
 * @remarks
 *   Each helper offers the whole scale where a recipe names no steps, so a component with a use
 *   for every step states nothing and one with a use for three states three. No recipe writes the
 *   scale out, and a scale that gains a step reaches every component that reads it.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";
import { recordOf } from "#record.ts";
import { SCALE, type Scale } from "#scales/geometry.ts";

/**
 * Pairs each step with the one below it, the smallest reading itself.
 */
const BELOW: Readonly<Record<Scale, Scale>> = {
  "2xl": "xl",
  "3xl": "2xl",
  "4xl": "3xl",
  lg: "md",
  md: "sm",
  sm: "xs",
  xl: "lg",
  xs: "xs",
};

/**
 * Writes the `size` axis of a control: its height, its inset, its gap and its label, each a step
 * of the semantic scale of the same name.
 *
 * @remarks
 *   A control that opens with a mark leads with one step less inset, because a mark is lighter
 *   than a word and the same inset on both sides reads as a gap before the mark. A control that
 *   holds a mark and nothing else states its own inset, which this one does not reach, because
 *   the two rules are equally specific and a recipe's compound is written after its variants.
 */
export function controlSizes(): Record<Scale, SystemStyleObject>;

/**
 * Writes the `size` axis of a control for the steps it names.
 *
 * @typeParam Offered - The steps the recipe offers.
 */
export function controlSizes<const Offered extends Scale>(
  sizes: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per step, each reading the four scales under that step's name.
 */
export function controlSizes(sizes: readonly Scale[] = SCALE): Record<string, SystemStyleObject> {
  return recordOf(sizes, (size) => ({
    "&:has(> svg:first-child)": { paddingInlineStart: `inset.${below(size)}` },
    gap: `gap.${size}`,
    height: `control.${size}`,
    paddingInline: `inset.${size}`,
    textStyle: `label.${size}`,
  }));
}

/**
 * Reads the step below the one named, the smallest step reading itself.
 *
 * @remarks
 *   A recipe drawing something lighter than a control at the same name reads the step below
 *   rather than restating the order of the scale, so a scale that gains a step reaches it too.
 * @param size - The step to read below.
 * @returns The step below it, or `xs` where it is already the smallest.
 */
export function below(size: Scale): Scale {
  return BELOW[size];
}

/**
 * Writes the `size` axis of a tag: its height, its inset, its gap and its label.
 */
export function tagSizes(): Record<Scale, SystemStyleObject>;

/**
 * Writes the `size` axis of a tag for the steps it names.
 *
 * @typeParam Offered - The steps the recipe offers.
 */
export function tagSizes<const Offered extends Scale>(
  sizes: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per step, the height on the tag scale and the rest one step below.
 *
 * @remarks
 *   A tag is read beside a control of its own name, so it is shorter than one and its inset, its
 *   gap and its label all come from the step below. A medium tag beside a medium button is half
 *   its height and carries the small label, which is the proportion a badge in a row of controls
 *   needs to read as a label on something rather than as a control of its own.
 */
export function tagSizes(sizes: readonly Scale[] = SCALE): Record<string, SystemStyleObject> {
  return recordOf(sizes, (size) => ({
    gap: `gap.${below(size)}`,
    height: `tag.${size}`,
    paddingInline: `inset.${below(size)}`,
    textStyle: `label.${below(size)}`,
  }));
}

/**
 * Writes the `size` axis of an icon: a square box on the icon scale.
 */
export function iconSizes(): Record<Scale, SystemStyleObject>;

/**
 * Writes the `size` axis of an icon for the steps it names.
 *
 * @typeParam Offered - The steps the recipe offers.
 */
export function iconSizes<const Offered extends Scale>(
  sizes: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per step, each a square box on the icon scale.
 */
export function iconSizes(sizes: readonly Scale[] = SCALE): Record<string, SystemStyleObject> {
  return recordOf(sizes, (size) => ({ boxSize: `icon.${size}` }));
}

/**
 * Writes the `size` axis of a square control that holds one icon and no label: a box on the
 * control scale with no inset.
 */
export function iconOnly(): Record<Scale, SystemStyleObject>;

/**
 * Writes the `size` axis of such a control for the steps it names.
 *
 * @typeParam Offered - The steps the recipe offers.
 */
export function iconOnly<const Offered extends Scale>(
  sizes: readonly Offered[],
): Record<Offered, SystemStyleObject>;

/**
 * Writes one entry per step, each a box on the control scale with no inset.
 */
export function iconOnly(sizes: readonly Scale[] = SCALE): Record<string, SystemStyleObject> {
  return recordOf(sizes, (size) => ({ boxSize: `control.${size}`, padding: "0" }));
}

/**
 * Widens the hit area of a control to a medium control's box under a coarse pointer, without
 * moving the visible box.
 *
 * @remarks
 *   The area is a pseudo-element centred on the control, which a pointer hits as part of it. The
 *   control is positioned under the coarse pointer alone, so a control that positions itself is
 *   left alone everywhere else. The area is drawn before the control's content rather than after
 *   it, which leaves the other pseudo-element to a look that draws one, the ripple among them.
 */
export function touchTarget(): SystemStyleObject {
  return {
    _touch: {
      _before: {
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
