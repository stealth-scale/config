/**
 * Decides which of the properties a part resolves to a table draws, and how far the reader walks
 * the types they refer to.
 *
 * @remarks
 *   A part resolves to far more than it accepts. `ButtonProps` resolves to 1341 properties: 762
 *   style props, 287 the rendering library declares, 284 styling conditions and six the component
 *   owns. Every rule here exists to find those six.
 */

/**
 * Matches the files a recipe is written in.
 *
 * @remarks
 *   The same two spellings the theme kit reads a preset's recipes under, so the convention is
 *   stated in one place for both.
 */
const RECIPES = /(?:^|\/)(?:recipe\.ts|[^/]+\.recipe\.ts)$/u;

/**
 * How deep the reader follows the types a prop refers to, unless a caller says otherwise.
 *
 * @remarks
 *   Two levels reach the details object a change handler is called with and the shape inside it,
 *   which is as far as a table has room for.
 */
const DEPTH = 2;

/**
 * How many members a type may hold before the reader names it rather than listing it.
 *
 * @remarks
 *   A handler's details object holds two or three. A type with two dozen is a library's internals
 *   rather than an answer to anybody's question.
 */
const MEMBERS = 24;

/**
 * Describes what a repository states about reading props.
 *
 * @remarks
 *   Every member has a default, so `props: {}` turns the reading on under the house rules. Which
 *   properties count is not stated here at all: a property declared by a recipe is a variant, one
 *   declared by the component's own package is an option, and everything else is dropped. Both
 *   rules read the compiler's own answer for where a declaration sits rather than a path a
 *   repository writes down.
 */
export interface Reading {
  /**
   * How deep to follow the types a prop refers to. Two by default.
   */
  readonly depth?: number | undefined;

  /**
   * How many members a type may hold before it is named rather than listed. Twenty-four by
   * default.
   */
  readonly members?: number | undefined;
}

/**
 * Describes the reading with every default filled in.
 */
export interface Settled {
  /**
   * How deep to follow the types a prop refers to.
   */
  readonly depth: number;

  /**
   * How many members a type may hold before it is named rather than listed.
   */
  readonly members: number;
}

/**
 * Fills in whatever a repository left to the defaults.
 */
export function settled(stated: Reading): Settled {
  return { depth: stated.depth ?? DEPTH, members: stated.members ?? MEMBERS };
}

/**
 * Returns true when a file is a recipe, so the properties it declares are the component's axes.
 */
export function isRecipe(path: string): boolean {
  return RECIPES.test(path);
}

/**
 * Returns true when a type holds few enough members to list rather than name.
 *
 * @remarks
 *   A type with none is nothing to show, so it is named as well.
 */
export function worthListing(members: number, cap: number): boolean {
  return members > 0 && members <= cap;
}
