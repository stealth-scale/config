/**
 * Every rule a stealth package is linted by, gathered from the domains beside this file.
 */

import { ASSET } from "#lint/rules/asset.ts";
import { DOCBLOCK } from "#lint/rules/docblock.ts";
import { MARKUP } from "#lint/rules/markup.ts";
import { type PluginRules } from "#lint/rules/rules.ts";
import { SAFETY } from "#lint/rules/safety.ts";
import { SIZE } from "#lint/rules/size.ts";
import { SORT } from "#lint/rules/sort.ts";
import { STYLE } from "#lint/rules/style.ts";

export { ASSET } from "#lint/rules/asset.ts";
export { CATEGORIES } from "#lint/rules/category.ts";
export { DOCBLOCK, DOCBLOCK_SETTINGS, docblocksOff } from "#lint/rules/docblock.ts";
export { MARKUP } from "#lint/rules/markup.ts";
export { JS_PLUGINS, PLUGINS } from "#lint/rules/plugin.ts";
export { type PluginRules, type Rules } from "#lint/rules/rules.ts";
export { SAFETY } from "#lint/rules/safety.ts";
export { SIZE } from "#lint/rules/size.ts";
export { SORT } from "#lint/rules/sort.ts";
export { STYLE } from "#lint/rules/style.ts";

/**
 * What every package is held to, wherever it runs.
 *
 * @returns The rules.
 */
export function base(): PluginRules {
  return { ...SIZE, ...SAFETY, ...STYLE, ...DOCBLOCK, ...SORT, ...ASSET };
}

/**
 * What a package the console runs is held to.
 *
 * The same as the base for now. Node's own relaxation — a package whose output _is_ the console —
 * is a property of that package rather than of node, so it is stated as an override over its own
 * paths rather than granted to everything running there.
 *
 * @returns The rules.
 */
export function node(): PluginRules {
  return base();
}

/**
 * What a package the browser runs is held to.
 *
 * @returns The rules, with what only means anything against a document.
 */
export function web(): PluginRules {
  return { ...base(), ...MARKUP };
}
