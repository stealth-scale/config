/**
 * What a stealth package's stylesheets are checked by.
 *
 * Stylelint runs as a plugin in the build rather than as a step of its own, because a stylesheet is
 * only reachable through the graph that imports it. A repository extends this and writes no
 * stylelint configuration of its own.
 *
 * What it is held to is Google's HTML/CSS style guide, the same guide the TypeScript rules follow.
 * Most of it is the shared stylelint set; the selector and cascade refusals are gathered here; and
 * the two rules about a leading zero and a quotation mark belong to the formatter, which is where
 * stylelint itself moved them.
 *
 * @packageDocumentation
 */

export * as override from "#override.ts";
export * as plugin from "#plugin/index.ts";
export * as rules from "#rules/index.ts";
