/**
 * Reads, writes and forgets a setting without React, which is what a server and an inline script
 * need.
 */

import { type SettingDefinition, settingKey } from "#define.ts";

/**
 * Tells whether stored text is one of the values a setting allows.
 *
 * @remarks
 *   A set of one string type is read as a set of strings to ask the question, because a set only
 *   answers for its own member type and the question here is whether the text is a member at all.
 *   Asking the set costs a seventh of what building an array and searching it costs, and allocates
 *   nothing, which matters because a component reads its setting on every render.
 */
function allowed<Value extends string>(
  values: ReadonlySet<Value>,
  stored: null | string,
): stored is Value {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- widening the member type is what lets the set answer for text it may not hold
  return stored !== null && (values as ReadonlySet<string>).has(stored);
}

/**
 * Reads a setting back, held to the values it is allowed to take.
 *
 * @remarks
 *   The stored text is matched against the values rather than trusted as one of them, so a key
 *   somebody edited by hand answers the fallback instead of a value the caller's types say is
 *   impossible.
 * @typeParam Value - The values the setting may take.
 * @param app - The application the setting belongs to.
 * @returns The value that was written, or the fallback where nothing was written and where what
 *   was written is not one of the values.
 */
export function readSetting<Value extends string>(
  app: string,
  setting: SettingDefinition<Value>,
): Value {
  const stored = setting.store.read(settingKey(app, setting.name));

  return allowed(setting.values, stored) ? stored : setting.fallback;
}

/**
 * Remembers a setting, and tells every reader watching it in this document.
 *
 * @typeParam Value - The values the setting may take.
 * @param app - The application the setting belongs to.
 */
export function writeSetting<Value extends string>(
  app: string,
  setting: SettingDefinition<Value>,
  value: Value,
): void {
  setting.store.write(settingKey(app, setting.name), value);
}

/**
 * Forgets a setting, so the next read answers the fallback.
 *
 * @typeParam Value - The values the setting may take.
 * @param app - The application the setting belongs to.
 */
export function clearSetting<Value extends string>(
  app: string,
  setting: SettingDefinition<Value>,
): void {
  setting.store.clear(settingKey(app, setting.name));
}
