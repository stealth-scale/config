/**
 * Reads the catalogues in the locale in force.
 */

import { type ReactNode } from "react";

import { type Catalogues, I18nProvider, type I18nSettings } from "@stealthscale/provider-i18n";

import { useLocale } from "#context.ts";

/**
 * Describes what {@link Translated} is given.
 */
export interface TranslatedProps {
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
 * Mounts the i18n provider in whichever locale is in force, so a change of locale changes every
 * string below.
 *
 * @param props - The catalogues, the settings and the page. `TranslatedProps` documents each.
 */
export function Translated({ catalogues, children, settings }: TranslatedProps): ReactNode {
  const { locale } = useLocale();

  if (catalogues === undefined) return children;

  return (
    <I18nProvider catalogues={catalogues} locale={locale} {...settings}>
      {children}
    </I18nProvider>
  );
}
