/**
 * Declares the two rule maps every group in this directory is written against.
 */

import { type UserConfig } from "vite";

/**
 * Describes the rules a Vite lint block accepts.
 *
 * @remarks
 *   A name the linter ships has its options checked against that rule's own
 *   schema. A name the linter does not know is accepted with whatever options
 *   accompany it, so a typo in a rule name is caught by the linter and not by
 *   the compiler.
 */
export type Rules = NonNullable<NonNullable<UserConfig["lint"]>["rules"]>;

/**
 * Describes the rules of a plugin the linter does not ship.
 *
 * @remarks
 *   Nothing is checked. A plugin rule is named `plugin/rule` and its options
 *   are the plugin's own, so neither the name nor the shape appears in a map
 *   the compiler can consult.
 */
export type PluginRules = Record<string, unknown>;
