/**
 * What a rule group is.
 */

import { type UserConfig } from "vite-plus";

/**
 * A rule name against what the linter should do about it.
 *
 * The linter's own map, which names every built-in rule and the shape of its options — so a
 * misspelled name or an option the rule does not take is a type error rather than a rule that
 * quietly never runs.
 */
export type Rules = NonNullable<NonNullable<UserConfig["lint"]>["rules"]>;

/**
 * A rule from a plugin loaded at run time, against what the linter should do about it.
 *
 * Loose because the linter's own map names only what it carries built in, so a plugin's rule name
 * cannot be checked against anything.
 */
export type PluginRules = Record<string, unknown>;
