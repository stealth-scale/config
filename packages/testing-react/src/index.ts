/**
 * Reading a rendered component in a specification.
 *
 * A component reports what it is doing through the `data-part` marking each piece of its anatomy
 * and the `data-` attributes carrying its state. Those are the handles a specification holds: a
 * class name changes with the recipe, the text changes with the copy, and the shape of the tree
 * changes whenever the library underneath is upgraded.
 *
 * Every reader here throws where the part it was asked for is absent, naming it. That is what lets
 * a specification write the read inline, without a guard at the call site and without the non-null
 * assertion the linter refuses — and it is what makes a failure say which part went missing rather
 * than that `undefined` is not `"open"`.
 *
 * @packageDocumentation
 */

export { type ConformanceOptions, violations } from "#conformance.tsx";
export { attr, renderedAs } from "#dom.ts";
export { only, part, parts } from "#part.ts";
