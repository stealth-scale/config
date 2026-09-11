/**
 * Reaching into a config by a dotted path, without mutating what was there.
 *
 * A contribution names the list it appends to as text — `lint.overrides`, `test.setupFiles` —
 * because the package contributing it and the package owning that list are not the same one, and a
 * path is the smallest thing the two have to agree on.
 */

/**
 * Holds an object being walked, whatever its declared shape.
 */
type Held = Record<string, unknown>;

/**
 * Answers whether a value is a plain object that can be walked into.
 *
 * @param value - The value found at a path.
 * @returns Whether it holds keys.
 */
function walkable(value: unknown): value is Held {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Appends an item to the list at a path, making the list and everything above it where absent.
 *
 * Answers the type it was handed, so a config goes in and a config comes out and no caller has to
 * assert its way back. Copies only along the path walked: everything else is the object that was
 * handed in, which keeps a config that is mostly untouched from being rebuilt once per
 * contribution.
 *
 * @typeParam Of - The shape being appended into.
 * @param held - The object to append into.
 * @param path - The dotted path of the list.
 * @param item - The value to append.
 * @returns A copy holding the longer list.
 */
export function appended<Of extends object>(held: Of, path: string, item: unknown): Of {
  const dot = path.indexOf(".");
  const step = dot < 0 ? path : path.slice(0, dot);
  const below: unknown = Reflect.get(held, step);

  const grown =
    dot < 0
      ? [...(Array.isArray(below) ? (below as readonly unknown[]) : []), item]
      : appended(walkable(below) ? below : {}, path.slice(dot + 1), item);

  return { ...held, [step]: grown };
}
