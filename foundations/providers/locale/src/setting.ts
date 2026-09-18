/**
 * Declares the setting a person's chosen locale is remembered under.
 */

import { defineSetting, type SettingDefinition, type SettingStore } from "@stealthscale/settings";

import { browserLanguages } from "#browser.ts";
import { negotiate } from "#negotiate.ts";

/**
 * The name the locale is remembered under.
 */
export const LOCALE_SETTING = "locale";

/**
 * Declares the locale setting for one set of offers.
 *
 * @remarks
 *   The fallback is negotiated rather than fixed, so a person who has chosen nothing reads in the
 *   best of the offers for what their browser asks for. A stored tag the application no longer
 *   offers falls back the same way, because `values` refuses it.
 * @param locales - The locales the application offers, the first being its own fallback.
 * @param store - Where to keep the choice. The page's local storage where this is absent.
 */
export function localeSetting(
  locales: readonly [string, ...string[]],
  store?: SettingStore,
): SettingDefinition<string> {
  return defineSetting({
    fallback: negotiate(browserLanguages(), locales, locales[0]),
    name: LOCALE_SETTING,
    ...(store === undefined ? {} : { store }),
    values: locales,
  });
}
