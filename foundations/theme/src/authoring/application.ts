/**
 * Describes what an application states about styling: its themes, and the presets it writes for
 * recipes of its own.
 *
 * @remarks
 *   A type and no function. An application writes an object and checks it with `satisfies`, so
 *   stating a theme costs the page nothing at run time. What reads the statement is the build
 *   plugin, which an application is not allowed to name. A recipe written in the application
 *   rather than in a package has no `./theme` subpath for the plugin to find, so the application
 *   states its preset here, and a theme extends the recipe by its key as it extends any other.
 */

import { type Theme } from "#authoring/theme.ts";
import { type Preset, type StaticCssOptions } from "#pandacss.ts";

/**
 * Describes an application's statement.
 */
export interface Application {
  /**
   * The presets the application writes for recipes of its own, installed after the preset of
   * every package on the dependency graph and before the themes, in the order given.
   */
  presets?: readonly Preset[] | undefined;

  /**
   * The recipes to compile outright, for a page that picks variants while it runs. A product
   * application states nothing here and gets the rules its own source asks for.
   */
  static?: "*" | StaticCssOptions | undefined;

  /**
   * The themes the page can wear. The first is the default, and every one of them switches under
   * its attribute. An application that states none draws the foundation alone.
   */
  themes?: readonly Theme[] | undefined;
}
