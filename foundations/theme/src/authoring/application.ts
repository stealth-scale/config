/**
 * Describes what an application states about styling, which is its themes and nothing else.
 *
 * @remarks
 *   A type and no function. An application writes an object and checks it with `satisfies`, so
 *   stating a theme costs the page nothing at run time. What reads the statement is the build
 *   plugin, which an application is not allowed to name.
 */

import { type Theme } from "#authoring/theme.ts";
import { type StaticCssOptions } from "#pandacss.ts";

/**
 * Describes an application's statement.
 */
export interface Application {
  /**
   * The recipes to compile outright, for a page that picks variants while it runs. A product
   * application states nothing here and gets the rules its own source asks for.
   */
  static?: "*" | StaticCssOptions | undefined;

  /**
   * The themes the page can wear. The first is the default, and every one of them switches under
   * its attribute.
   */
  themes: readonly [Theme, ...Theme[]];
}
