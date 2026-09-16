/**
 * Re-exports the generated runtime under this package's own name, by a curated list.
 *
 * @remarks
 *   Everything here is generated from the foundation when this package is built, and every other
 *   package reads it through `@stealthscale/theme`. The list is curated rather than a wildcard,
 *   because the generated JSX module exports a `createRecipeContext` of its own, which a wildcard
 *   would publish over the binding this package defines. `cva` and `sva` stay out: a component
 *   styles itself through its config recipe, and the generated slot context reads `sva` itself.
 */

export { breakpointKeys } from "#generated/css/conditions.mjs";
export { css, cx } from "#generated/css/index.mjs";
export { styled } from "#generated/jsx/index.mjs";
export { token } from "#generated/tokens/index.mjs";
export type * from "#generated/types/jsx.d.mts";
export type * from "#generated/types/recipe.d.mts";
export type * from "#generated/types/system.d.mts";
export type * from "#generated/types/tokens.d.mts";

/**
 * Fixes the attribute a page writes its theme in, on the document root or on any element for a
 * subtree.
 *
 * @remarks
 *   The compiler emits every theme under an attribute of its own naming, and the build plugin
 *   rewrites it to this one, so nothing a page sees names the compiler.
 */
export const THEME_ATTRIBUTE = "data-theme";

/**
 * Fixes the attribute a page writes its color mode in, on the document root or on any element
 * for a subtree.
 */
export const COLOR_MODE_ATTRIBUTE = "data-color-mode";
