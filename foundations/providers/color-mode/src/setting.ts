/**
 * Names the colour modes and declares the setting the chosen one is remembered under.
 */

import { defineSetting, type SettingDefinition, type SettingStore } from "@stealthscale/settings";
import { type ColorMode } from "@stealthscale/theme";

/**
 * Selects what a person chose, which may be to follow the machine rather than to pick either mode.
 *
 * @remarks
 *   The provider writes a choice to follow the machine as the absence of the attribute, which is
 *   how the design system already reads a page nobody has switched. It is a value here rather than
 *   an absence because a setting keeps text, and because a picker lists it beside the other two.
 */
export type ColorModeChoice = "system" | ColorMode;

/**
 * Lists the two modes a person can pick.
 */
export const COLOR_MODES: readonly ColorMode[] = ["light", "dark"];

/**
 * The media query the machine's own setting is read from.
 */
export const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

/**
 * The setting's own name, which the provider and the inline script both build their key from.
 */
export const COLOR_MODE_SETTING = "color-mode";

/**
 * Declares the setting the chosen mode is remembered under.
 *
 * @remarks
 *   The fallback is `system`, which is not one of the values, because following the machine is what
 *   somebody who has chosen nothing wants and is not a mode they picked. A page that writes no
 *   attribute is already drawn that way by the stylesheet, so the fallback needs nothing written.
 * @param store - Where to keep the choice. The page's local storage where this is absent. A
 *   cookie store is what an application renders on a server uses, so the first response carries
 *   the attribute.
 * @returns The setting, for the provider and for anything reading it without React.
 */
export function colorModeSetting(store?: SettingStore): SettingDefinition<ColorModeChoice> {
  return defineSetting({
    fallback: "system",
    name: COLOR_MODE_SETTING,
    store,
    values: COLOR_MODES,
  });
}
