/**
 * Declares one setting: its name, the values it may take, what it falls back to, and where it is
 * kept.
 */

import { type SettingStore } from "#store.ts";
import { localStore } from "#stores/local.ts";

/**
 * Describes one setting, as everything that reads or writes it needs to know.
 *
 * @typeParam Value - The values the setting may take.
 */
export interface SettingDefinition<Value extends string> {
  /**
   * The value answered until a person chooses, and whenever what is written is not one of the
   * values.
   */
  readonly fallback: Value;

  /**
   * The setting's own name, such as `color-mode`, `theme` or `locale`.
   */
  readonly name: string;

  /**
   * Where the setting is kept. Part of the definition rather than of a call, so one setting is
   * kept in one place on a server and in a browser alike.
   */
  readonly store: SettingStore;

  /**
   * The values the setting may take. A value read back is matched against these rather than
   * trusted, because it has been through a store where anything could have written anything.
   */
  readonly values: ReadonlySet<Value>;
}

/**
 * Describes what a setting is declared with.
 *
 * @typeParam Value - The values the setting may take.
 */
export interface SettingOptions<Value extends string> {
  /**
   * The value answered until a person chooses. It may be one of the values or something else, such
   * as a colour mode that follows the machine until somebody overrides it.
   */
  fallback: Value;

  /**
   * The setting's own name.
   */
  name: string;

  /**
   * Where to keep the setting. The page's local storage where this is absent.
   */
  store?: SettingStore | undefined;

  /**
   * The values the setting may take.
   */
  values: readonly Value[];
}

/**
 * Writes the key a setting is kept under.
 *
 * @remarks
 *   Two applications on one origin keep their own settings, which is what the application's name
 *   is for. Anything reading a setting outside React, such as the script an application inlines to
 *   settle its first paint, writes the key with this rather than by hand.
 * @returns The key, as `stealth.<app>.<name>`.
 */
export function settingKey(app: string, name: string): string {
  return `stealth.${app}.${name}`;
}

/**
 * Declares a setting, held to a list of values and kept in the store it names.
 *
 * @remarks
 *   The fallback is stated apart from the values, so a setting whose fallback is not one of the
 *   choices states both without repeating either.
 * @typeParam Value - The values the setting may take.
 * @returns The definition every reader and writer of the setting is given.
 */
export function defineSetting<const Value extends string>(
  options: SettingOptions<Value>,
): SettingDefinition<Value> {
  return {
    fallback: options.fallback,
    name: options.name,
    store: options.store ?? localStore(),
    values: new Set(options.values),
  };
}
