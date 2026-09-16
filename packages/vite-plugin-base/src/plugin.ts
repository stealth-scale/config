/**
 * What a bundler plugin is here, and the one place its type comes from.
 */

import { type Plugin } from "vite";

export { type Plugin };

/**
 * What a hook is handed to reach the build it is running inside.
 *
 * This type is read off the plugin's own hook rather than written out, so a change to what the
 * bundler passes is a type error here rather than a plugin reading a field nothing sets. Vite's
 * `Plugin` extends rolldown's, so a plugin written against this one works under either.
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
   * The name the bundler reports the plugin as.
   */
  name: string;

  /**
   * What it does once the chunks exist and before they are written.
   *
   * The one moment a plugin here needs. The module graph is complete, so what the build reached
   * can be read. The output has not been written, so a file can still be added to it.
   *
   * @param bundling - The build it is running inside.
   * @param at - The directory being built, which the bundler resolved.
   * @returns Nothing, or a promise for when it is finished.
   */
  writes: (bundling: Bundling, at: string) => Promise<void> | void;
}

/**
 * Builds a plugin that passes the build to its hook as an argument.
 *
 * The bundler calls a hook with the build as `this`, which an arrow function cannot reach and a
 * plain function is easy to get wrong. Binding it once here lets every plugin written against this
 * take the build as an ordinary argument, and nothing downstream reads `this`.
 *
 * @param stated - The plugin. `Stated` documents every member.
 * @returns The plugin, in the shape any rolldown or Vite build accepts.
 */
export function plugin(stated: Stated): Plugin {
  let at = process.cwd();

  return {
    /**
     * Remembers what the bundler resolved as the directory being built.
     *
     * This is read from the build rather than from the plugin's caller. Under a task runner the
     * working directory is the workspace root, so a plugin reading that describes the wrong
     * package. The bundler has already resolved the right directory.
     *
     * @param config - The resolved configuration.
     */
    configResolved(config: Resolved): void {
      at = config.root;
    },

    /**
     * Passes the build to the stated hook, so nothing downstream reads `this`.
     *
     * @returns A promise when the plugin returned one, and nothing otherwise.
     */
    generateBundle(this: Bundling): Promise<void> | void {
      return stated.writes(this, at);
    },

    name: stated.name,
  };
}
