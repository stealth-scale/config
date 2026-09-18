/**
 * Puts the strings an application is read in into scope, in the locale it is given.
 *
 * A package keeps its catalogues under `locales/<language>/<namespace>.json` beside its code and
 * reads them with `useTranslation("<namespace>")`, its keys typed from its own fallback file. An
 * application overrides any package's string by declaring the same language, namespace and key. The
 * catalogue plugin finds them all and exports `virtual:i18n`, which the shell hands to
 * `I18nProvider`.
 *
 * I18next underneath, re-exported under this design system's names, so a component imports it
 * nowhere.
 *
 * @packageDocumentation
 */

export { type Catalogues, NONE, type Words } from "#catalogues.ts";
export {
  applied,
  type Changed,
  CHANGED,
  createI18n,
  type I18nOptions,
  type I18nSettings,
} from "#create-i18n.ts";
export { I18nProvider, type I18nProviderProps } from "#i18n-provider.tsx";
export { type Resources } from "#resources.ts";
export { type FlatNamespace, type KeyPrefix, type ParseKeys } from "i18next";
export { type FallbackNs, Trans, useTranslation, type UseTranslationResponse } from "react-i18next";
