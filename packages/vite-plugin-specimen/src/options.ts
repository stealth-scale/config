/**
 * Declares the specifiers the plugin resolves and the options a repository configures it with.
 */

/**
 * The specifier a catalogue imports the index from.
 */
export const ID = "virtual:specimen-index";

/**
 * The specifier prefix a catalogue imports one page's scenes as source from. The page's identifier
 * follows it.
 */
export const FRAGMENTS = "virtual:specimen-fragments/";

/**
 * Describes what a repository configures the index with.
 */
export interface Options {
  /**
   * The globs to search, resolved against the project root.
   *
   * @remarks
   *   Required rather than defaulted. A pattern is relative to the application root, and an
   *   application that shows a catalogue of a workspace's components sits beside those components
   *   rather than above them, so no default is right for both arrangements. Several patterns are
   *   accepted, because a catalogue gathers directories that share no parent and because a pattern
   *   pointing into `node_modules` is how an installed package's specimens are found.
   */
  readonly patterns: readonly string[];
}
