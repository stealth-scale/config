/**
 * What a rule group is.
 */

import { type UserConfig } from "vite";

/**
 * A rule name against what the linter should do about it.
 *
 * The linter's own map, which names every built-in rule and the shape of its options — so a
 * severity the rule does not take, or an option of the wrong type, is a type error rather than a
 * rule configured into doing nothing.
 *
 * A name it does not know is taken as written, because the map stays open for the rules a plugin
 * brings. A misspelling is therefore not caught here, and the linter reporting nothing from a rule
 * is what a repository sees instead.
 */
export type Rules = NonNullable<NonNullable<UserConfig["lint"]>["rules"]>;

/**
 * A rule from a plugin loaded at run time, against what the linter should do about it.
 *
 * Loose because the linter's own map names only what it carries built in, so a plugin's rule name
 * cannot be checked against anything.
 */
export type PluginRules = Record<string, unknown>;
