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
 * Reads whatever sits at a path.
 *
 * @param held - The object to read.
 * @param path - The dotted path.
 * @returns The value there, or nothing where the path names nothing.
 */
export function at(held: object, path: string): unknown {
  let found: unknown = held;

  for (const step of path.split(".")) {
    if (!walkable(found)) return undefined;
    found = found[step];
  }

  return found;
}

/**
 * Appends an item to the list at a path, making the list and everything above it where absent.
 *
 * Answers the type it was handed, so a config goes in and a config comes out and no caller has to
 * assert its way back. Copies only along the path walked: everything else is the object that was
 * handed in, which keeps a config that is mostly untouched from being rebuilt once per
 * contribution, and lets the provenance record compare by identity.
 *
 * @typeParam Of - The shape being appended into.
 * @param held - The object to append into.
 * @param path - The dotted path of the list.
 * @param item - The value to append.
 * @returns A copy holding the longer list.
 */
export function appended<Of extends object>(held: Of, path: string, item: unknown): Of {
  const [step, ...rest] = path.split(".");
  if (step === undefined) return held;

  const below: unknown = Reflect.get(held, step);

  const grown =
    rest.length > 0
      ? appended(walkable(below) ? below : {}, rest.join("."), item)
      : [...(Array.isArray(below) ? (below as readonly unknown[]) : []), item];

  return { ...held, [step]: grown };
}

/**
 * Lists every leaf path an object holds.
 *
 * An array counts as a leaf. A contribution appends to one and a preset replaces one, and the
 * provenance record says which layer did that rather than which element moved.
 *
 * @param held - The object to walk.
 * @param prefix - The path it sits at, for a nested call.
 * @returns Every path holding something that is not a plain object.
 */
export function leaves(held: object, prefix = ""): readonly string[] {
  return Object.entries(held).flatMap(([key, value]: [string, unknown]) => {
    const path = prefix === "" ? key : `${prefix}.${key}`;

    return walkable(value) ? leaves(value, path) : [path];
  });
}
