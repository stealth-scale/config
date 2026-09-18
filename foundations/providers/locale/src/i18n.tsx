/**
 * Mounts the i18n provider in whichever locale is in force.
 */

import { type ReactNode } from "react";

import {
  type Catalogues,
  type I18nSettings,
  I18nProvider as Provider,
} from "@stealthscale/provider-i18n";

import { useLocale } from "#context.ts";

/**
 * Describes what {@link I18nProvider} is given.
 */
export interface I18nProviderProps {
  /**
   * The catalogues, which is what `virtual:i18n` exports. Nothing is put in scope where this is
   * absent: whatever instance is already there answers, which is a specification's own or none.
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
 * @param props - The catalogues, the settings and the page. `I18nProviderProps` documents each.
 */
export function I18nProvider({ catalogues, children, settings }: I18nProviderProps): ReactNode {
  const { locale } = useLocale();

  if (catalogues === undefined) return children;

  return (
    <Provider catalogues={catalogues} locale={locale} {...settings}>
      {children}
    </Provider>
  );
}
