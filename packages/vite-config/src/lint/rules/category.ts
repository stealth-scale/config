/**
 * Which whole categories of finding fail rather than warn.
 */

import { type UserConfig } from "vite";

/**
 * The categories a stealth package fails on.
 *
 * A finding is a warning by default, and a warning does not fail `vp check` — so a repository could
 * carry every one of them and still report itself green. `correctness`, `pedantic`, `perf` and
 * `suspicious` name defects; `style` and `restriction` name positions, and a house that denies
 * those spends its attention arguing about them.
 *
 * `pedantic` is bearable only because `SAFETY` turns one rule inside it off. With that rule on it
 * reports five times as much as the other three together, none of it about the code.
 */
export const CATEGORIES: NonNullable<NonNullable<UserConfig["lint"]>["categories"]> = {
  correctness: "error",
  pedantic: "error",
  perf: "error",
  suspicious: "error",
};
