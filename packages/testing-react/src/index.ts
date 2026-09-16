/**
 * Reading a rendered component in a specification.
 *
 * A component reports what it is doing through the `data-part` marking each piece of its anatomy
 * and the `data-` attributes carrying its state. A specification reads those rather than a class
 * name, which changes with the recipe, or the text, which changes with the copy, or the shape of
 * the tree, which changes when the library underneath is upgraded.
 *
 * Every reader here throws when the part it was asked for is absent, and names it. A specification
 * can therefore write the read inline, with no guard at the call site and no non-null assertion,
 * and a failure reports which part went missing rather than that `undefined` is not `"open"`.
 *
 * @packageDocumentation
 */

export { type ConformanceOptions, violations } from "#conformance.tsx";
export { aria, attr, holds, renderedAs } from "#dom.ts";
export { only, part, parts, type Rendered } from "#part.ts";
