/**
 * The linter's own plugins the rules are named under.
 */

import { type UserConfig } from "vite";

/**
 * The plugins a stealth package's rules are written against.
 *
 * All built in, so none is installed and none goes quiet when something is not. A rule needing a
 * plugin from npm belongs in `jsPlugins`, where its absence is visible.
 */
export const PLUGINS: NonNullable<NonNullable<UserConfig["lint"]>["plugins"]> = [
  "typescript",
  "unicorn",
  "oxc",
  "import",
  "promise",
];

/**
 * The plugins fetched from npm, which the linter does not carry.
 *
 * Named rather than loaded silently: a rule whose plugin is missing is reported as a failure to
 * load rather than quietly never running, so a repository that has not installed these is told.
 */
export const JS_PLUGINS = [
  { name: "jsdoc-js", specifier: "eslint-plugin-jsdoc" },
  { name: "perfectionist", specifier: "eslint-plugin-perfectionist" },
  { name: "tsdoc", specifier: "eslint-plugin-tsdoc" },
  { name: "vitest-js", specifier: "@vitest/eslint-plugin" },
];
