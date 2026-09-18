/**
 * Reads what a field needs off a schema and the values: the schema of a property by its path,
 * whether it is required, its text and choices, how many items an array holds, and the name a
 * path is bound to inside a repeat group.
 */

import { type Schema } from "#schema.ts";
import { isSchema } from "#walk.ts";

/**
 * Reads the schema of a property by its path, following `[]` into an array's items.
 *
 * @returns The property's schema, or nothing where the schema has no property at the path.
 */
export function propertyOf(schema: Schema, path: string): Schema | undefined {
  let node: Schema | undefined = schema;

  for (const segment of path.split(".")) {
    const [name = "", ...items] = segment.split("[]");
    const properties = node?.["properties"];
    const property: unknown = isSchema(properties) ? properties[name] : undefined;

    node = isSchema(property) ? property : undefined;

    for (let depth = items.length; depth > 0; depth -= 1) {
      const inner: unknown = node?.["items"];

      node = isSchema(inner) ? inner : undefined;
    }
  }

  return node;
}

/**
 * Reports whether a schema requires the property at a path, read off the schema holding it.
 */
export function requiredIn(schema: Schema, path: string): boolean {
  const at = path.lastIndexOf(".");
  const holder = at === -1 ? schema : propertyOf(schema, path.slice(0, at));
  const required = holder?.["required"];

  return Array.isArray(required) && required.includes(path.slice(at + 1));
}

/**
 * Reads the text a schema states under `title` or `description`, which is a label's or a help
 * text's development text.
 *
 * @returns The text, or nothing where the schema states none.
 */
export function textOf(schema: Schema, keyword: "description" | "title"): string | undefined {
  const text = schema[keyword];

  return typeof text === "string" ? text : undefined;
}

/**
 * Reads the choices a schema lists under `enum`, strings alone.
 */
export function choicesOf(schema: Schema): readonly string[] {
  const { enum: choices } = schema;

  return Array.isArray(choices)
    ? choices.filter((choice): choice is string => typeof choice === "string")
    : [];
}

/**
 * Matches an index inside brackets, which a bound name writes.
 */
const INDEXED = /\[(\d+)\]/gu;

/**
 * Reads the value at a bound name of the values, or nothing where the name reaches nothing.
 */
export function valueAt(values: unknown, name: string): unknown {
  return name
    .replaceAll(INDEXED, ".$1")
    .split(".")
    .reduce<unknown>(
      (current, key) =>
        typeof current === "object" && current !== null ? Reflect.get(current, key) : undefined,
      values,
    );
}

/**
 * Counts the items at a bound name of the values, or zero where there is no array.
 */
export function countAt(values: unknown, name: string): number {
  const held = valueAt(values, name);

  return Array.isArray(held) ? held.length : 0;
}

/**
 * Binds a presentation path to the items of the repeat groups around it.
 *
 * @remarks
 *   Each `[]` in the path takes the next index given, outermost first, so `lines[].amount` bound
 *   to `[2]` is `lines[2].amount`, which is the name the form binds the field by. A `[]` with no
 *   index for it is left as it is.
 */
export function bound(path: string, indices: readonly number[]): string {
  let at = 0;

  return path.replaceAll("[]", () => {
    const index = indices[at];

    at += 1;

    return index === undefined ? "[]" : `[${index}]`;
  });
}
