/**
 * Reads a setting in a component, and follows it wherever it is changed.
 */

import { useSyncExternalStore } from "react";

import { readSetting, writeSetting } from "#access.ts";
import { type SettingDefinition, settingKey } from "#define.ts";

/**
 * Describes one setting bound to one application, as the three functions a reader needs.
 *
 * @typeParam Value - The values the setting may take.
 */
interface Bound<Value extends string> {
  /**
   * Reads the value, held to what the setting allows.
   */
  read: () => Value;

  /**
   * Calls back whenever the setting changes, whichever document changed it.
   *
   * @returns How to stop listening.
   */
  subscribe: (onChange: () => void) => () => void;

  /**
   * Writes a value and tells every reader of this setting.
   */
  write: (value: Value) => void;
}

/**
 * The three functions already built for each setting, by the application they were bound to.
 *
 * @remarks
 *   Held against the definition rather than in a component, so two components reading one setting
 *   share one subscription closure and one reader. A definition nothing refers to is collected
 *   with whatever it was bound to.
 */
const bindings = new WeakMap<object, Map<string, unknown>>();

/**
 * Binds a setting to an application, building the three functions once.
 *
 * @remarks
 *   Built outside React on purpose. A hook that rebuilt them would name the application and the
 *   setting as dependencies, and the identity a subscription is compared by would then change
 *   whenever a caller re-rendered with a fresh definition.
 * @typeParam Value - The values the setting may take.
 * @param app - The application the setting belongs to.
 * @returns How to read, watch and write this setting for this application.
 */
function boundTo<Value extends string>(
  app: string,
  setting: SettingDefinition<Value>,
): Bound<Value> {
  const held = bindings.get(setting) ?? new Map<string, unknown>();

  bindings.set(setting, held);

  const already = held.get(app);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the map is keyed by the definition the values were built from, so what it holds for one was built for that one
  if (already !== undefined) return already as Bound<Value>;

  const built: Bound<Value> = {
    read: () => readSetting(app, setting),
    subscribe: (onChange) => setting.store.subscribe(settingKey(app, setting.name), onChange),
    write: (value) => {
      writeSetting(app, setting, value);
    },
  };

  held.set(app, built);

  return built;
}

/**
 * Returns what a setting holds and the function that changes it.
 *
 * @remarks
 *   Every component reading one setting reads one value, in this tab and in every other, because
 *   the value is read from the store on each render rather than copied into state. Two
 *   consequences follow. A setting changed in another tab reaches this one, so the tab a person
 *   left open cannot overwrite the choice they made somewhere else. A write the store refuses,
 *   which a full disk and a private window both do, leaves the value as it was rather than showing
 *   one that was never kept.
 *   A server renders from the same read rather than from a fallback. A cookie store built from the
 *   request then puts the remembered value in the first response, which is the whole reason to
 *   keep a setting in a cookie, and a store the server cannot reach answers the fallback anyway.
 * @typeParam Value - The values the setting may take.
 * @param app - The application the setting belongs to, which has to match what the server and any
 *   inline script use.
 * @returns The value, and the function that writes it.
 */
export function useSetting<Value extends string>(
  app: string,
  setting: SettingDefinition<Value>,
): readonly [Value, (value: Value) => void] {
  const bound = boundTo(app, setting);
  const value = useSyncExternalStore(bound.subscribe, bound.read, bound.read);

  return [value, bound.write];
}
