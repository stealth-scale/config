/**
 * Mounts the i18n provider in whichever locale is in force.
 */

import { type ReactElement, type ReactNode } from "react";

import {
  type Catalogues,
  type I18nSettings,
  NONE,
  I18nProvider as Provider,
} from "@stealthscale/provider-i18n";

import { useLocale } from "#context.ts";

/**
 * Describes what {@link I18nProvider} is given.
 */
export interface I18nProviderProps {
  /**
   * The catalogues, which is what `virtual:i18n` exports. Catalogues holding nothing where this is
   * absent, so every key resolves to itself.
   */
  readonly catalogues?: Catalogues | undefined;

  /**
   * The page read in the catalogues.
   */
  readonly children?: ReactNode | undefined;

  /**
   * The i18next options the application decides beyond the catalogues and the locale.
   */
  readonly settings?: I18nSettings | undefined;
}

/**
 * Reads the locale in force and mounts the i18n provider in it.
 *
 * @remarks
 *   A component of its own rather than a prop on `LocaleProvider`, because the locale reaches it
 *   through context and only a child can read that. An application that reads in a locale and
 *   translates nothing leaves this out, and bundles no i18next.
 *   An instance is mounted whether or not there are catalogues to mount. Rendering the page with
 *   none leaves `useTranslation` without an instance, which resolves a key to itself and logs
 *   `NO_I18NEXT_INSTANCE` for every component that reads one.
 * @param props - The catalogues, the settings and the page. `I18nProviderProps` documents each.
 */
export function I18nProvider({
  catalogues = NONE,
  children,
  settings,
}: I18nProviderProps): ReactElement {
  const { locale } = useLocale();

  return (
    <Provider catalogues={catalogues} locale={locale} {...settings}>
      {children}
    </Provider>
  );
}
