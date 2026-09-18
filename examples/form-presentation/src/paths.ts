/**
 * Reads what the fields need off a schema, the values and a group: a property by its path,
 * whether it is required, how many items an array holds, and how a group is keyed and laid out.
 */

import { type Words } from "@stealthscale/example-form-fields";
import { type Group, isSchema, type Schema, type Translate } from "@stealthscale/provider-form";

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
 * Counts the items at a path of the values, or zero where there is no array.
 */
export function countAt(values: unknown, path: string): number {
  const held = path
    .split(".")
    .reduce<unknown>(
      (current, name) =>
        typeof current === "object" && current !== null ? Reflect.get(current, name) : undefined,
      values,
    );

  return Array.isArray(held) ? held.length : 0;
}

/**
 * The index a member has outside a repeat group.
 */
export const OUTSIDE = -1;

/**
 * Binds a presentation path to one item of a repeat group, or leaves it as it is outside one.
 *
 * @returns The path with its first `[]` written as `[index]`, which is the name the form binds
 *   the field by.
 */
export function bound(path: string, index: number): string {
  return index === OUTSIDE ? path : path.replace("[]", `[${index}]`);
}

/**
 * Keys a group for React, by its name or by what it holds.
 */
export function keyOf(group: Group): string {
  return group.name ?? JSON.stringify(group.of);
}

/**
 * Picks the layout class of a group. A group with columns is a grid, a group with the row
 * direction is a row, and any other group is a column.
 */
export function layoutOf(group: Group): string {
  if (group.columns !== undefined) return `grid columns-${group.columns}`;

  return group.direction === "row" ? "row" : "column";
}

/**
 * Resolves the legend of a group: the catalogue's words for its name, or the words under another
 * identifier it names, or nothing where it draws no fieldset.
 */
export function legendOf(group: Group, words: Words, translate: Translate): string | undefined {
  if (group.legend === undefined || group.legend === false) return undefined;

  return typeof group.legend === "string"
    ? translate(group.legend, { defaultValue: group.legend })
    : words.legend(group.name ?? "");
}
