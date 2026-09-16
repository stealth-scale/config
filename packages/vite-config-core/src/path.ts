/**
 * Grows a list buried in a config without knowing what the config holds.
 *
 * @remarks
 *   A contribution names its target as a dotted path, so this file is the only
 *   place a Vite key is reached by string rather than by property.
 */

/**
 * An object this file is willing to walk into.
 */
type Held = Record<string, unknown>;

/**
 * Reports whether a value can be stepped into on the way to the list.
 *
 * @remarks
 *   An array fails the check although it is an object, because a path stepping
 *   through one would index it by a name rather than a number.
 */
function walkable(value: unknown): value is Held {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Copies an object with one item added to the list at a dotted path.
 *
 * @remarks
 *   The path is a run of property names separated by dots, such as
 *   `test.setupFiles`, which leaves a property whose own name holds a dot out
 *   of reach. Every level along it is copied and everything beside it is
 *   carried over by reference, a missing level is created, and anything at the
 *   end that is not an array is thrown away for a list holding the one item.
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
