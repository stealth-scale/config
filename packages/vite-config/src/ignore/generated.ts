/**
 * Excludes the files a tool wrote rather than a person.
 */

/**
 * The globs matching generated source, under either spelling this repository
 * uses.
 *
 * @remarks
 *   The formatter, the linter and the coverage report all read this one list,
 *   so a generated file is never reformatted into a diff nor counted against a
 *   threshold nobody can move. Nothing installed or built is named here; the
 *   foreign list covers those.
 */
export const GENERATED: readonly string[] = ["**/*.gen.*", "**/generated/**"];
