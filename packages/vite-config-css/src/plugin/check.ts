/**
 * Checking a stylesheet while it is being built, which is the only time anything reads it.
 */

import { createRequire } from "node:module";
import stylelint from "vite-plugin-stylelint";

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { all } from "#rules/index.ts";

/**
 * Where a contribution to the list of plugins lands.
 */
const AT = "plugins";

/**
 * The shared set every stylesheet answers to, as a path rather than a name.
 *
 * Resolved here rather than named in the config, because the config is handed to Stylelint without
 * a file to resolve it from: a name would be looked for beside whatever repository is building, and
 * this package is the one that depends on it.
 */
const STANDARD = createRequire(import.meta.url).resolve("stylelint-config-standard");

/**
 * The plugins whose rules this package names, as paths for the same reason.
 *
 * Stylelint loads a plugin only where the config says to, so naming a rule from one without listing
 * it here reports the rule as unknown rather than running it.
 */
const PLUGINS = [
  "stylelint-order",
  "stylelint-use-nesting",
  "stylelint-high-performance-animation",
].map((name) => createRequire(import.meta.url).resolve(name));

/**
 * Describes what a repository knows about its own stylesheets that this package cannot.
 */
export interface Checked {
  /**
   * The globs to check beyond the ones the plugin reaches on its own.
   */
  also?: readonly string[];

  /**
   * The globs to leave unchecked: a vendored stylesheet, or one a tool wrote.
   */
  except?: readonly string[];

  /**
   * The rules this repository answers to beyond the shared set.
   *
   * Merged over what the shared set states, so a rule named here wins. `null` turns one off, which
   * is how stylelint spells it.
   */
  rules?: Readonly<Record<string, unknown>>;

  /**
   * Reports without failing, for a repository adopting this on a codebase that does not pass yet.
   *
   * A temporary state by construction: nothing that only warns gets fixed, so the reason for
   * reaching for this is the reason to stop.
   */
  warn?: boolean;
}

/**
 * Checks every stylesheet the build reaches, and fails on what it finds.
 *
 * A stylesheet is the one thing in a repository the type checker never sees. A property spelled
 * wrong is not a syntax error and not a type error; it is simply ignored by the browser, so the
 * rule never applies and nothing says why.
 *
 * `build` is asked for and is not optional. The plugin defaults it off — `dev` is already on — so a
 * repository adding the plugin the plain way gets one that loads, says nothing about any build, and
 * looks like it is working. That default is the reason for this entry point. `dev` is stated beside
 * it so that a change of heart upstream cannot turn either off quietly.
 *
 * The rules are handed over rather than read from a file, so a repository keeps no stylelint
 * configuration of its own: the shared set, plus what Google asks for beyond it, plus whatever the
 * repository adds here.
 *
 * The plugin's own cache is off, which is stylelint's default and not the plugin's. It writes
 * `.stylelintcache` into the package it is linting, so the build both reads and writes a file
 * inside its own directory and the task runner will not cache it — trading a whole cached build for
 * a partial linting speedup. What the cache would have saved is small anyway: `lintOnStart` is off,
 * so stylesheets are linted as the build reaches them rather than all at once.
 *
 * @param stated - The repository's own answers about its stylesheets. `Checked` documents every
 *   member.
 * @returns The contribution the bundler runs the linter from.
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
