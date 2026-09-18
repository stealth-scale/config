/**
 * Walks a schema for what a form needs to know about it before any value exists: the path of
 * every property any branch can produce, the formats it names, and the paths a draft leaves out.
 */

import { type Schema } from "#schema.ts";

/**
 * Receives each property schema the walk reaches, with the path a form names it by.
 */
type Visit = (path: string, schema: Schema) => void;

/**
 * Lists the keywords whose value is a list of branch schemas over the same value.
 */
const BRANCHES = ["allOf", "anyOf", "oneOf"] as const;

/**
 * Lists the keywords whose value is one branch schema over the same value.
 */
const CONDITIONALS = ["then", "else"] as const;

/**
 * The keyword a property writes to keep its value out of a draft.
 */
export const PERSIST = "x-persist";

/**
 * Reports whether a value is a schema, which is any object that is not a list.
 */
export function isSchema(value: unknown): value is Schema {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Joins a property's name onto the path of the schema holding it.
 */
function under(path: string, name: string): string {
  return path === "" ? name : `${path}.${name}`;
}

/**
 * Walks the properties and the items of one schema.
 */
function walkMembers(schema: Schema, visit: Visit, path: string): void {
  const properties = schema["properties"];

  if (isSchema(properties)) {
    for (const [name, child] of Object.entries(properties)) {
      if (!isSchema(child)) continue;

      visit(under(path, name), child);
      walk(child, visit, under(path, name));
    }
  }

  const items = schema["items"];

  if (isSchema(items)) {
    visit(`${path}[]`, items);
    walk(items, visit, `${path}[]`);
  }
}

/**
 * Walks every branch of one schema that describes the same value: `allOf`, `anyOf`, `oneOf`,
 * `then`, `else` and `dependentSchemas`.
 */
function walkBranches(schema: Schema, visit: Visit, path: string): void {
  for (const keyword of BRANCHES) {
    const branches = schema[keyword];

    if (!Array.isArray(branches)) continue;

    for (const branch of branches) if (isSchema(branch)) walk(branch, visit, path);
  }

  for (const keyword of CONDITIONALS) {
    const branch = schema[keyword];

    if (isSchema(branch)) walk(branch, visit, path);
  }

  const dependent = schema["dependentSchemas"];

  if (isSchema(dependent)) {
    for (const branch of Object.values(dependent)) if (isSchema(branch)) walk(branch, visit, path);
  }
}

/**
 * Walks a schema and calls back for every property any branch can produce.
 *
 * @remarks
 *   A property is visited once per branch that declares it, so a caller collecting paths keeps a
 *   set. `if` is not walked, because it states a condition and never a field to draw. The path is
 *   that of the schema walked, and empty for the root.
 */
export function walk(schema: Schema, visit: Visit, path = ""): void {
  walkMembers(schema, visit, path);
  walkBranches(schema, visit, path);
}

/**
 * Lists the path of every property any branch of the schema can produce, each once, in the order
 * the walk reaches them.
 */
export function pathsIn(schema: Schema): readonly string[] {
  const found = new Set<string>();

  walk(schema, (path) => {
    found.add(path);
  });

  return [...found];
}

/**
 * Lists every format the schema names, at the root or under any path, each once.
 */
export function formatsIn(schema: Schema): readonly string[] {
  const found = new Set<string>();

  /**
   * Notes the format one schema names, where it names one.
   */
  const note = (node: Schema): void => {
    const format = node["format"];

    if (typeof format === "string") found.add(format);
  };

  note(schema);
  walk(schema, (_, node) => {
    note(node);
  });

  return [...found];
}

/**
 * Lists the paths a draft never keeps: a password, and a property marked `x-persist: false`.
 */
export function sensitivePaths(schema: Schema): readonly string[] {
  const found = new Set<string>();

  walk(schema, (path, node) => {
    if (node["format"] === "password" || node[PERSIST] === false) found.add(path);
  });

  return [...found];
}
