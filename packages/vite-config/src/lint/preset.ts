/**
 * How a stealth package is linted.
 */

import { type UserConfig } from "vite";

import { type Layer, preset } from "@stealthscale/vite-config-core";

import { GENERATED } from "#ignore/generated.ts";
import { defaultExported, specified, undocumented } from "#lint/departure.ts";
import * as rules from "#lint/rules/index.ts";

/**
 * The `lint` block of a config.
 */
type LintBlock = NonNullable<UserConfig["lint"]>;

/**
 * Reads a gathered rule set as the block's own rule map.
 *
 * The block types `rules` as the linter's built-in map, which names no rule a plugin supplies. A
 * gathered set holds both, so it is widened here rather than every domain giving up the checking it
 * gets from being declared strictly.
 *
 * @param held - The gathered rules.
 * @returns The same, as the block takes them.
 */
function asRules(held: rules.PluginRules): NonNullable<LintBlock["rules"]> {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- a plugin's rule name is in no map the linter publishes
  return held as NonNullable<LintBlock["rules"]>;
}

/**
 * What a tool reads by its default export rather than by name.
 */
const DEFAULT_EXPORTED = ["**/*.config.ts"];

/**
 * What documents itself by its own names rather than by a docblock.
 */
const UNDOCUMENTED = ["**/*.spec.ts", "**/*.fixtures.ts"];

/**
 * The same, where the package renders.
 *
 * Markup is the only reason a specification is written `.tsx`, so a package the console runs has
 * none and is not excused one.
 */
const RENDERED = ["**/*.spec.tsx", "**/*.fixtures.tsx"];

/**
 * What states behaviour as named cases.
 *
 * Narrower than {@link UNDOCUMENTED}, which also covers fixtures. A fixture builds the values a
 * specification reads and declares no case of its own.
 */
const SPECIFIED = ["**/*.spec.ts"];

/**
 * The same, where the package renders.
 */
const SPECIFIED_RENDERED = ["**/*.spec.tsx"];

/**
 * What is true of a package wherever it runs, beside the rules themselves.
 *
 * `typeAware` is the only decision made here rather than among the rules: it is about what the
 * linter can see rather than what it checks. Left off it reads syntax alone, which is a fraction of
 * what there is to get wrong in a typed language.
 */
const SHARED: LintBlock = {
  categories: rules.CATEGORIES,
  ignorePatterns: [...GENERATED],
  jsPlugins: rules.JS_PLUGINS,
  options: { typeAware: true, typeCheck: true },
  plugins: rules.PLUGINS,
  settings: rules.DOCBLOCK_SETTINGS,
};

/**
 * Lints a package, saying nothing about where it runs.
 *
 * A package reaching for neither node's globals nor the browser's takes this. One reaching for
 * either takes `node` or `web`, which is the same statement it makes to the type checker by
 * extending one of the two tsconfigs.
 *
 * @returns The layers.
 */
export function base(): readonly Layer[] {
  return [
    preset({
      config: { lint: { ...SHARED, rules: asRules(rules.base()) } },
      name: "lint.base",
    }),
    defaultExported(DEFAULT_EXPORTED),
    undocumented(UNDOCUMENTED),
    specified(SPECIFIED),
  ];
}

/**
 * Lints a package the console runs.
 *
 * @returns The layers.
 */
export function node(): readonly Layer[] {
  return [
    preset({
      config: { lint: { ...SHARED, env: { node: true }, rules: asRules(rules.node()) } },
      name: "lint.node",
    }),
    defaultExported(DEFAULT_EXPORTED),
    undocumented(UNDOCUMENTED),
    specified(SPECIFIED),
  ];
}

/**
 * Lints a package the browser runs.
 *
 * @returns The layers.
 */
export function web(): readonly Layer[] {
  return [
    preset({
      config: { lint: { ...SHARED, env: { browser: true }, rules: asRules(rules.web()) } },
      name: "lint.web",
    }),
    defaultExported(DEFAULT_EXPORTED),
    undocumented([...UNDOCUMENTED, ...RENDERED]),
    specified([...SPECIFIED, ...SPECIFIED_RENDERED]),
  ];
}
