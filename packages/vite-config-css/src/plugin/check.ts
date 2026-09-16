/**
 * Wires Stylelint into a build, and resolves the Stylelint packages the run
 * needs before it starts.
 */

import { createRequire } from "node:module";
import stylelint from "vite-plugin-stylelint";

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { all } from "#rules/index.ts";

/**
 * The Vite key this check appends its plugin to.
 */
const AT = "plugins";

/**
 * Locates the shared guide the rule sets are layered over.
 *
 * @remarks
 *   The configuration is assembled here rather than written to a file, so
 *   Stylelint has no directory to resolve a bare specifier against and is
 *   handed a path instead. A repository that has not installed the peer finds
 *   out while this module loads.
 */
const STANDARD = createRequire(import.meta.url).resolve("stylelint-config-standard");

/**
 * Locates every Stylelint plugin the run loads, as absolute paths.
 *
 * @remarks
 *   Stylelint reports a rule from a plugin it has not loaded as unknown and
 *   fails the run, so this list covers more than the rule sets currently turn
 *   on. A repository adding a rule of its own through `rules` can reach any
 *   plugin named here without loading it again.
 */
const PLUGINS = [
  "stylelint-order",
  "stylelint-use-nesting",
  "stylelint-high-performance-animation",
].map((name) => createRequire(import.meta.url).resolve(name));

/**
 * Chooses what the shared stylesheet check reads, and how hard it fails.
 *
 * @remarks
 *   Every field is optional. Stating none of them checks whatever the plugin
 *   considers a stylesheet against the four rule sets and fails the build on a
 *   violation.
 */
export interface Checked {
  /**
   * Extra globs to check, beside the ones the plugin picks up on its own.
   */
  also?: readonly string[];

  /**
   * Globs to leave unchecked, such as a stylesheet vendored from elsewhere.
   */
  except?: readonly string[];

  /**
   * Rules layered over the shared sets, by Stylelint rule name. A name a set
   * already declares takes the value given here.
   */
  rules?: Readonly<Record<string, unknown>>;

  /**
   * Whether a violation is reported as a warning instead of failing the build.
   */
  warn?: boolean;
}

/**
 * Builds the layer that runs Stylelint over the stylesheets a package imports.
 *
 * @remarks
 *   The plugin runs during a build and behind a development server alike, and
 *   it caches nothing, so a rule a repository changes applies on the next run
 *   rather than after a cache is thrown away.
 * @param stated - The globs and rules this repository departs on. Omitting it
 *   checks everything against the shared sets.
 * @returns A contribution named `css.check`, appended to Vite's plugin array.
 */
export function check(stated: Checked = {}): Contribution {
  return contribute({
    at: AT,
    because: "a stylesheet is the one thing in a repository the type checker never reads",
    item: stylelint({
      build: true,
      cache: false,
      config: { extends: [STANDARD], plugins: PLUGINS, rules: { ...all(), ...stated.rules } },
      dev: true,
      emitErrorAsWarning: stated.warn ?? false,
      ...(stated.also === undefined ? {} : { include: [...stated.also] }),
      ...(stated.except === undefined ? {} : { exclude: [...stated.except] }),
    }),
    name: "css.check",
  });
}
