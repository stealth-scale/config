/**
 * Resolves the linter plugins every rule group is written against.
 */

import { type UserConfig } from "vite";

/**
 * Lists the plugins the linter already ships, turned on by name alone.
 */
export const PLUGINS: NonNullable<NonNullable<UserConfig["lint"]>["plugins"]> = [
  "typescript",
  "unicorn",
  "oxc",
  "import",
  "promise",
];

/**
 * Lists the plugins loaded from npm, each under the name its rules go by.
 *
 * @remarks
 *   The alias is not the package name. `eslint-plugin-jsdoc` is loaded as
 *   `jsdoc-js`, so its rules are configured as `jsdoc-js/require-jsdoc` and not
 *   under the prefix the plugin's own documentation shows.
 */
export const JS_PLUGINS = [
  { name: "jsdoc-js", specifier: "eslint-plugin-jsdoc" },
  { name: "perfectionist", specifier: "eslint-plugin-perfectionist" },
  { name: "tsdoc", specifier: "eslint-plugin-tsdoc" },
  { name: "vitest-js", specifier: "@vitest/eslint-plugin" },
];
