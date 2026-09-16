/**
 * Fixes the export condition that reaches a workspace package's source.
 */

/**
 * The condition every package here publishes its TypeScript source under.
 *
 * @remarks
 *   The same string appears in the shared tsconfig's customConditions, in the
 *   exports map of every package, and in what the packer is told to write.
 *   Changing it in one of the three leaves an importer resolving to built
 *   output that a fresh checkout has not produced yet.
 */
export const SOURCE = "stealth-source";
