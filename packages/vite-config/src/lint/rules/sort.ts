/**
 * Fixes the order of the members a reader looks up by name.
 *
 * @remarks
 *   A list is sorted only where its order carries no meaning. An array, an
 *   enum, a set and a class each have an order somebody chose, and none of them
 *   is sorted here.
 */

import { type PluginRules } from "#lint/rules/rules.ts";

/**
 * Sorts within a run of lines and starts over after a blank one.
 *
 * @remarks
 *   A blank line is how an author groups the members that belong together.
 *   Sorting across it would merge those groups, and the grouping is information
 *   the author put there on purpose.
 */
const PARTITIONED = { partitionByNewLine: true, type: "alphabetical" } as const;

/**
 * Sorts every member of a declaration, blank lines and all.
 *
 * @remarks
 *   A member of an interface or an object type is separated by a blank line
 *   because a doc comment sits above it. Partitioning on that blank line would
 *   put each member in a group of its own and sort nothing.
 */
const THROUGHOUT = { partitionByNewLine: false, type: "alphabetical" } as const;

/**
 * Orders the imports, the exports, the type members and the object literals.
 *
 * @remarks
 *   A switch is sorted too, which holds only because
 *   `noFallthroughCasesInSwitch` refuses a case that runs into the next one.
 *   That is the one arrangement where the position of a case is its meaning.
 */
export const SORT: PluginRules = {
  "perfectionist/sort-export-attributes": ["error", { type: "alphabetical" }],
  "perfectionist/sort-exports": ["error", PARTITIONED],
  "perfectionist/sort-heritage-clauses": ["error", { type: "alphabetical" }],
  "perfectionist/sort-import-attributes": ["error", { type: "alphabetical" }],
  "perfectionist/sort-interfaces": ["error", THROUGHOUT],
  "perfectionist/sort-intersection-types": ["error", PARTITIONED],
  "perfectionist/sort-jsx-props": ["error", PARTITIONED],
  "perfectionist/sort-named-exports": ["error", { type: "alphabetical" }],
  "perfectionist/sort-named-imports": ["error", { type: "alphabetical" }],
  "perfectionist/sort-object-types": ["error", THROUGHOUT],
  "perfectionist/sort-objects": ["error", PARTITIONED],
  "perfectionist/sort-switch-case": ["error", { type: "alphabetical" }],
  "perfectionist/sort-union-types": ["error", PARTITIONED],
};
