/**
 * Takes the slots of a slot recipe from the anatomy of the component it draws, and lifts an axis
 * written for one element onto one part of several.
 *
 * @remarks
 *   An anatomy lists its parts once, and a recipe that restated them would drift from it. The
 *   compiler's definition takes a mutable array, so the parts are copied into one.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Describes the one thing read from an anatomy: the parts it names.
 *
 * @typeParam Part - Each part's name.
 */
export interface Anatomy<Part extends string> {
  /**
   * Lists the parts the anatomy stamps.
   */
  keys: () => readonly Part[];
}

/**
 * Takes the parts of an anatomy as the slots of a recipe, typed as the tuple of their names.
 *
 * @typeParam Part - Each part's name.
 */
export function slotsOf<const Part extends string>(anatomy: Anatomy<Part>): Part[] {
  return [...anatomy.keys()];
}

/**
 * Lifts an axis written for a recipe that draws one element onto one part of a slot recipe.
 *
 * @remarks
 *   The helpers that write an axis return the styles of an element, and a slot recipe states its
 *   styles under a part. A grid reading the alignment axes onto its root is the case.
 * @typeParam Part - The part the axis styles.
 * @typeParam Values - Each value of the axis, against the styles it states.
 */
export function onSlot<const Part extends string, Values extends Record<string, SystemStyleObject>>(
  slot: Part,
  values: Values,
): { [Value in keyof Values]: Record<Part, SystemStyleObject> } {
  const lifted = Object.entries(values).map(([value, styles]) => [value, { [slot]: styles }]);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- built from every value of the axis, each under the one part named
  return Object.fromEntries(lifted) as { [Value in keyof Values]: Record<Part, SystemStyleObject> };
}

/**
 * Lifts one axis onto several parts at once, each part reading its own scale.
 *
 * @remarks
 *   A size axis usually moves every part of a component together: the room inside the root, the
 *   gap in the content, the box of the mark and the size of the title all step at one name. Written
 *   out that is one object per step holding one entry per part, which is the shape a recipe author
 *   should never have to type. This takes a scale per part and turns it inside out, so each step of
 *   the axis holds the styles every part states at that step.
 *   A part offering fewer steps than another is left out of the steps it does not offer, rather
 *   than reported, because a recipe may well size three parts over eight steps and a fourth over
 *   five.
 * @typeParam Part - Each part the axis styles.
 * @typeParam Values - Each value of the axis, against the styles a part states.
 */
export function onSlots<
  const Part extends string,
  Values extends Record<string, SystemStyleObject>,
>(
  parts: Readonly<Record<Part, Values>>,
): {
  [Value in keyof Values]: Partial<Record<Part, SystemStyleObject>>;
} {
  const named = Object.entries<Values>(parts);
  const steps = new Set(named.flatMap(([, scale]) => Object.keys(scale)));
  const lifted = [...steps].map((step) => [
    step,
    Object.fromEntries(
      named
        .map(([slot, scale]) => [slot, scale[step]] as const)
        .filter((pair): pair is readonly [string, SystemStyleObject] => pair[1] !== undefined),
    ),
  ]);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- built from every step of the axis, each holding the parts that state one
  return Object.fromEntries(lifted) as {
    [Value in keyof Values]: Partial<Record<Part, SystemStyleObject>>;
  };
}
