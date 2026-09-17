/**
 * Publishes the colour mode: which way a page is drawn, what a person chose, and the script that
 * settles the first paint. The choice is remembered per application, and following the machine is
 * written as the absence of an attribute so the stylesheet decides.
 *
 * @packageDocumentation
 */

export { type ColorModeContextValue, useColorMode } from "#context.ts";
export { ColorModeProvider, type ColorModeProviderProps } from "#provider.tsx";
export { useSystemColorMode } from "#scheme.ts";
export { colorModeScript } from "#script.ts";
export {
  COLOR_MODE_SETTING,
  COLOR_MODES,
  type ColorModeChoice,
  colorModeSetting,
  DARK_SCHEME_QUERY,
} from "#setting.ts";
