/**
 * Declares the modules the specimen plugin serves, so that importing one type-checks.
 *
 * @remarks
 *   A catalogue references this with a triple-slash directive naming
 *   `@stealthscale/vite-plugin-specimen/client`, from a file it already compiles. Both modules
 *   exist only in a build the plugin takes part in.
 */

declare module "virtual:specimen-index" {
  import { type Indexed } from "@stealthscale/vite-plugin-specimen";

  /**
   * Every page found, sorted by the path it was read from.
   */
  export const pages: readonly Indexed[];
}

declare module "virtual:specimen-fragments/*" {
  /**
   * Each scene's source, keyed by the scene's title.
   */
  export const fragments: Readonly<Record<string, string>>;
}
