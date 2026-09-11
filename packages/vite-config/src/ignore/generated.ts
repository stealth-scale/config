/**
 * What a tool wrote, which every other tool walks past.
 */

/**
 * What a tool wrote rather than a person.
 *
 * Nothing here is anybody's to change: the way to change it is to change the tool or its input, and
 * the file is overwritten on the next run either way. A linter reporting a finding in one asks for
 * a fix that cannot be kept, and a formatter rewriting one starts a fight it loses on the next run.
 * `node_modules` and a build directory are already walked past, so neither is named here.
 *
 * The conventional spellings for a written file, and a directory of them.
 */
export const GENERATED: readonly string[] = ["**/*.gen.*", "**/generated/**"];
