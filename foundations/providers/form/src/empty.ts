/**
 * Empties the values a person has to choose, so a select opens on no choice and a box that has to
 * be ticked starts unticked.
 */

import { type Schema } from "#schema.ts";
import { walk } from "#walk.ts";

/**
 * Answers the empty value of a type: an empty string, `false`, zero, and nothing for a type that
 * has none.
 */
function emptyOf(type: unknown): unknown {
  switch (type) {
    case "boolean": {
      return false;
    }
    case "integer":
    case "number": {
      return 0;
    }
    case "string": {
      return "";
    }
    default: {
      return undefined;
    }
  }
}

/**
 * Reports whether a value is an object a property can be read off or written to.
 */
function isMutable(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Reads the value at a path of an object, segment by segment, or nothing where the path is absent.
 */
function at(values: unknown, segments: readonly string[]): unknown {
  return segments.reduce<unknown>(
    (current, segment) => (isMutable(current) ? current[segment] : undefined),
    values,
  );
}

/**
 * Writes a value at a path of an object, where every object on the way exists.
 */
function write(target: unknown, segments: readonly string[], value: unknown): void {
  const holder = at(target, segments.slice(0, -1));

  if (isMutable(holder)) holder[String(segments.at(-1))] = value;
}

/**
 * Answers the empty value a schema starts from, where a person has to choose its value and the
 * schema states no `default`, or nothing where the library's own value stands.
 */
function chosen(node: Schema): unknown {
  if (node["default"] !== undefined) return undefined;

  return node["enum"] === undefined && node["const"] === undefined
    ? undefined
    : emptyOf(node["type"]);
}

/**
 * Empties every value a person has to choose, unless the values given supply it.
 *
 * @remarks
 *   The engine's library fills an `enum` with its first choice and a `const` with its value, so a
 *   select would open on a choice nobody made and a consent box would start ticked. A schema with
 *   either keyword and no `default` starts from the empty value of its type instead, at the root
 *   and at every property, and one with a `default` or a type that has no empty value is left as
 *   the library built it. A property under an array's items is left alone, because an item exists
 *   only once a person adds one.
 * @returns The values built, changed in place, or the empty value where the root itself is a
 *   choice.
 */
export function emptied(schema: Schema, built: unknown, given?: unknown): unknown {
  const root = chosen(schema);

  if (root !== undefined && given === undefined) return root;

  walk(schema, (path, node) => {
    const segments = path.split(".");
    const empty = path.includes("[]") ? undefined : chosen(node);

    if (empty !== undefined && at(given, segments) === undefined) write(built, segments, empty);
  });

  return built;
}
