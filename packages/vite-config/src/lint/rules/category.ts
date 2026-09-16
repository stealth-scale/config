/**
 * Sets the severity of each category the linter groups its own rules under.
 */

import { type UserConfig } from "vite";

/**
 * Denies the four categories that name a defect and leaves the rest untouched.
 *
 * @remarks
 *   A rule under `correctness`, `pedantic`, `perf` or `suspicious` reports code
 *   that is wrong on its own terms. `restriction` and `style` report a position
 *   somebody holds, and this house states those one rule at a time so that each
 *   arrives with a reason.
 */
export const CATEGORIES: NonNullable<NonNullable<UserConfig["lint"]>["categories"]> = {
  correctness: "error",
  pedantic: "error",
  perf: "error",
  suspicious: "error",
};
