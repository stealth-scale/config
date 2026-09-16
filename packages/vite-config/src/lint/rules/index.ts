/**
 * Gathers the rule groups into the set each tier applies.
 *
 * @remarks
 *   Every rule is named in exactly one group, and the groups are spread in a
 *   fixed order. A rule appearing in two would be settled silently by that
 *   order, which is a sign the groups are drawn in the wrong place.
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
export { SPEC } from "#lint/rules/spec.ts";
export { STYLE } from "#lint/rules/style.ts";

/**
 * Collects the rules that hold wherever the code ends up running.
 *
 * @remarks
 *   Nothing in this set names a host API. A package can be moved between the
 *   console and the browser without any of these findings changing.
 */
export function base(): PluginRules {
  return { ...SIZE, ...SAFETY, ...STYLE, ...DOCBLOCK, ...SORT, ...ASSET };
}

/**
 * Collects the rules for a package the console runs.
 *
 * @remarks
 *   Nothing is added to the base set. This tier differs from the base tier in
 *   the environment its preset declares, not in the rules it applies.
 */
export function node(): PluginRules {
  return base();
}

/**
 * Collects the rules for a package the browser runs.
 *
 * @remarks
 *   The markup group is added last and is the only group naming a DOM API. A
 *   package the console runs is never held to it.
 */
export function web(): PluginRules {
  return { ...base(), ...MARKUP };
}
