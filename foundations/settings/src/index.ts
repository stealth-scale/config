/**
 * Publishes the setting: one named value a person chose, kept per application and held to the
 * values it is allowed to take. Where a setting is kept is part of its definition, so a cookie
 * reaches the server before it renders and local storage reaches every open tab.
 *
 * @packageDocumentation
 */

export { clearSetting, readSetting, writeSetting } from "#access.ts";
export { defineSetting, type SettingDefinition, settingKey, type SettingOptions } from "#define.ts";
export { type SettingStore, type Watchers, watchers } from "#store.ts";
export { cookieStore, type CookieStoreOptions } from "#stores/cookie.ts";
export { localStore } from "#stores/local.ts";
export { memoryStore } from "#stores/memory.ts";
export { useSetting } from "#use-setting.ts";
