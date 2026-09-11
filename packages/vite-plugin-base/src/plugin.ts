/**
 * What a bundler plugin is here, and the one place its type comes from.
 */

import { type Plugin } from "vite";

export { type Plugin };

/**
 * What a hook is handed to reach the build it is running inside.
 *
 * Read off the plugin's own hook rather than written out, so a change to what the bundler passes is
 * a type error here rather than a plugin that reads a field nothing sets. Vite's `Plugin` extends
 * rolldown's, which is what makes a plugin written against this one work under either.
 */
export type Bundling = ThisParameterType<
  Extract<NonNullable<Plugin["generateBundle"]>, (...args: never[]) => unknown>
>;

/**
 * The part of a resolved configuration a plugin here reads.
 */
interface Resolved {
  /**
   * The directory the bundler settled on as the one being built.
   */
  root: string;
}

/**
 * Describes a plugin.
 */
export interface Stated {
  /**
   * What it is called, which is what the bundler reports it as.
   */
  name: string;

  /**
   * What it does once the chunks exist and before they are written.
   *
   * The one moment a plugin here needs. The module graph is complete, so what the build reached is
   * knowable; the output has not been written, so a file can still be added to it.
   *
   * @param bundling - The build it is running inside.
   * @param at - The directory being built, which the bundler resolved.
   * @returns Nothing, or a promise for when it is finished.
   */
  writes: (bundling: Bundling, at: string) => Promise<void> | void;
}

/**
 * States a plugin, with the build handed over as an argument.
 *
 * The bundler calls a hook with the build as `this`, which an arrow function cannot reach and a
 * plain one is easy to get wrong in. Binding it once here means every plugin written against this
 * takes the build as an ordinary argument and nothing downstream writes `this` at all.
 *
 * @param stated - The plugin. `Stated` documents every member.
 * @returns The plugin, as any rolldown or Vite build will take one.
 */
export function plugin(stated: Stated): Plugin {
  let at = process.cwd();

  return {
    /**
     * Remembers what the bundler resolved as the directory being built.
     *
     * Asked of the build rather than of the plugin's caller. The working directory is the workspace
     * root under a task runner, so a plugin reading that describes the wrong package; the bundler
     * has already worked out the right answer and this is where it says so.
     *
     * @param config - The resolved configuration.
     */
    configResolved(config: Resolved): void {
      at = config.root;
    },

    /**
     * Hands the build to what was stated, so nothing downstream reaches for `this`.
     *
     * @returns A promise where the plugin answered one, and nothing otherwise.
     */
    generateBundle(this: Bundling): Promise<void> | void {
      return stated.writes(this, at);
    },

    name: stated.name,
  };
}
