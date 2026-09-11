/**
 * What no tool should walk into, because nobody wrote it here.
 */

/**
 * The directories holding something other than this repository's source.
 *
 * Installed, built, reported, or the repository's own bookkeeping. None of it was written by hand
 * here, so nothing a tool says about it is anybody's to act on.
 *
 * Named rather than assumed because naming a list replaces it: a runner walks past the first two on
 * its own, and stating where a test lives takes that back unless the list is given in full.
 */
export const FOREIGN = ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/coverage/**"];
