/**
 * Writes the styles a recipe takes under compact density, which is an attribute on any element.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Nests styles under the compact condition, so they apply inside a subtree marked compact and
 * nowhere else.
 */
export function dense(styles: SystemStyleObject): SystemStyleObject {
  return { _compact: styles };
}
