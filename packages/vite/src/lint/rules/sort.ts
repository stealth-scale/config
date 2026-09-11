/**
 * Sorting everything sortable, so a diff shows a change rather than a reordering.
 */

import { type PluginRules } from "#lint/rules/rules.ts";

/**
 * Sorted, with a blank line starting a new block.
 *
 * A deliberate grouping survives — a manifest's `name` before its `version`, a union's ordinary
 * case before its failures — because the sorter treats a blank line as the end of one group and the
 * start of another.
 */
const PARTITIONED = { partitionByNewLine: true, type: "alphabetical" } as const;

/**
 * Sorted throughout, blank lines and all.
 *
 * What a type's own members take. The docblock standard puts a blank line between every one of
 * them, so partitioning there would divide the members into groups of one and sort nothing.
 */
const THROUGHOUT = { partitionByNewLine: false, type: "alphabetical" } as const;

/**
 * What is sorted, and how.
 *
 * Import order is absent because the formatter holds it: `fmt.imports` sorts every import on every
 * save, and a second sorter here would only be a thing to keep in step.
 *
 * Sorting a list whose order carries no meaning loses nothing, and stops a diff showing
 * reorderings. `sort-objects` is the one that reaches something observable — a literal's key order
 * is what `Object.keys` answers — and it is on anyway, because code reading its own literal back in
 * declaration order is relying on something no reader should have to know. What is deliberately
 * absent is the other kind:
 *
 * An array's order is its data, and a map's and a set's iteration order is insertion order and
 * observable, so `sort-arrays`, `sort-maps` and `sort-sets` stay off. A module's declaration order
 * is its reading order and a top-level `const` can be moved past its own use, so `sort-modules`
 * does too. A field initialiser may read a field above it, which rules out `sort-classes` and
 * `sort-variable-declarations`; decorators compose in the order written; and `erasableSyntaxOnly`
 * refuses enums, so there are none for `sort-enums` to sort.
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

  // Safe only because `noFallthroughCasesInSwitch` refuses a case that falls into the next one,
  // which is the one arrangement where a case's position is its meaning.
  "perfectionist/sort-switch-case": ["error", { type: "alphabetical" }],
  "perfectionist/sort-union-types": ["error", PARTITIONED],
};
