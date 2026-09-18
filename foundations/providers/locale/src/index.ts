/**
 * Which locale a page is read in, and the direction that follows from it.
 *
 * What a person chose, else the best of the locales an application offers for what their browser
 * asks for, else the first. Remembered per application. Rendered above the catalogues, because
 * every one of them is read in whatever this decides.
 *
 * @packageDocumentation
 */

export { browserLanguages } from "#browser.ts";
export { LocaleContext, type LocaleContextValue, useLocale } from "#context.ts";
export { negotiate, type Preference, preferences } from "#negotiate.ts";
export { LocaleProvider, type LocaleProviderProps } from "#provider.tsx";
export { LOCALE_SETTING, localeSetting } from "#setting.ts";
export {
  canonical,
  chain,
  type Direction,
  directionOf,
  type Parts,
  parts,
  type Tag,
  widened,
  widenedChain,
} from "#tags.ts";
export { Translated, type TranslatedProps } from "#translated.tsx";
