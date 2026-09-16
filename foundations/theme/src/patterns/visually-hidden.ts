/**
 * Draws an element a screen reader announces and a sighted reader never sees, for the label an
 * icon-only control keeps.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Draws an element off the visible page and out of the layout, without hiding it from assistive
 * technology.
 */
export function visuallyHidden(): SystemStyleObject {
  return { srOnly: true };
}
