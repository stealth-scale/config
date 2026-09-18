/**
 * Keeps a form's values and step in a store, so a refresh finds the form as a person left it.
 */

import { settingKey, type SettingStore } from "@stealthscale/settings";

import { type Schema } from "#schema.ts";
import { isSchema } from "#walk.ts";

/**
 * Describes what was kept of a form.
 *
 * @typeParam Values - The form's values.
 */
export interface Draft<Values = unknown> {
  /**
   * The hash of the schema the values were typed against.
   */
  readonly hash: string;

  /**
   * The step a person was on, where the form has steps.
   */
  readonly step?: string | undefined;

  /**
   * The values, less the paths that are never kept.
   */
  readonly values: Values;
}

/**
 * Writes the key a form's draft is kept under.
 *
 * @remarks
 *   The key is a setting key, so a draft is kept beside the application's other settings and two
 *   applications on one origin keep their own.
 * @returns The key, as `stealth.<app>.form.<id>`.
 */
export function draftKey(app: string, id: string): string {
  return settingKey(app, `form.${id}`);
}

/**
 * Writes a value as JSON with its keys in order, so two equal schemas hash the same.
 */
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map((item) => stable(item)).join(",")}]`;

  if (isSchema(value)) {
    const entries = Object.keys(value)
      .toSorted()
      .map((key) => `${JSON.stringify(key)}:${stable(value[key])}`);

    return `{${entries.join(",")}}`;
  }

  return JSON.stringify(value) ?? "null";
}

/**
 * Hashes a schema, so a draft typed against another schema is told apart.
 *
 * @remarks
 *   FNV-1a over the schema written with its keys in order. A change to any keyword changes the
 *   hash, and the order the keywords were written in does not.
 * @returns The hash, as eight hexadecimal digits.
 */
export function schemaHash(schema: Schema): string {
  const text = stable(schema);
  let hash = 0x81_1c_9d_c5;

  for (const character of text) {
    hash ^= Number(character.codePointAt(0));
    hash = Math.imul(hash, 0x01_00_01_93) >>> 0;
  }

  return hash.toString(16).padStart(8, "0");
}

/**
 * Reports whether a value is an object a path can be removed from.
 */
function isMutable(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Removes the value at one path from a value, in place, following `[]` into every item.
 */
function remove(target: unknown, segments: readonly string[]): void {
  const [head, ...rest] = segments;

  if (head === undefined || !isMutable(target)) return;

  const name = head.endsWith("[]") ? head.slice(0, -2) : head;
  const held = target[name];

  if (head.endsWith("[]")) {
    if (Array.isArray(held)) for (const item of held) remove(item, rest);

    return;
  }

  if (rest.length === 0) delete target[name];
  else remove(held, rest);
}

/**
 * Copies a value with the paths given removed, following `[]` into every item of an array.
 *
 * @remarks
 *   The copy is structural, so the form's own values are untouched, and a path that does not
 *   exist in the value is ignored.
 * @typeParam Values - The form's values.
 */
export function withoutPaths<Values>(values: Values, paths: readonly string[]): Values {
  const copy: Values = structuredClone(values);

  for (const path of paths) remove(copy, path.split("."));

  return copy;
}

/**
 * Reports whether stored text parsed to the shape of a draft.
 */
function isDraft(value: unknown): value is Draft {
  return isSchema(value) && typeof value["hash"] === "string" && "values" in value;
}

/**
 * Parses the text a store holds into a draft, where it is one and it was typed against the schema
 * given.
 *
 * @remarks
 *   The hash is that of the schema the form works from. Text that is not a draft, and a draft
 *   whose hash differs, parse to nothing.
 * @typeParam Values - The form's values.
 * @returns The draft, or nothing.
 */
export function parseDraft<Values>(text: string, hash: string): Draft<Values> | undefined {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = undefined;
  }

  if (isDraft(parsed) && parsed.hash === hash) {
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the hash matched, so the values were written by a form over the schema the caller's type describes
    return parsed as Draft<Values>;
  }

  return undefined;
}

/**
 * Keeps a draft under a key.
 */
export function writeDraft(store: SettingStore, key: string, draft: Draft): void {
  store.write(key, JSON.stringify(draft));
}
