/**
 * Writes the motion a thing enters and leaves with, as two animation styles the theme owns.
 */

import type { SystemStyleObject } from "#generated/types/system.d.mts";

/**
 * Writes the open and closed states of a thing that animates, each reading an animation style.
 *
 * @param enter - The animation style the thing opens with.
 * @param exit - The animation style it closes with.
 */
export function motion(enter: string, exit: string): SystemStyleObject {
  return { _closed: { animationStyle: exit }, _open: { animationStyle: enter } };
}
