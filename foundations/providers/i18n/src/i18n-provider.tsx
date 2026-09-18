/**
 * Puts the strings in scope for everything below it, in the locale it is given.
 */

import { type ReactElement, type ReactNode, useEffect, useState } from "react";

import { I18nextProvider } from "react-i18next";

import { type Catalogues } from "#catalogues.ts";
import { createI18n, type I18nSettings } from "#create-i18n.ts";

/**
 * The props {@link I18nProvider} takes.
 */
export interface I18nProviderProps extends I18nSettings {
  /**
   * The catalogues found, which is what `virtual:i18n` exports.
   */
  catalogues: Catalogues;

  /**
   * The subtree that reads the strings.
   */
  children?: ReactNode | undefined;

  /**
   * The BCP 47 tag to read in. Changing it re-renders every component below with the new strings,
   * and fetches the language when it is not yet loaded.
   */
  locale: string;
}

/**
 * Renders the subtree with an i18next instance in scope.
 *
 * @remarks
 *   The instance is built once from the catalogues and the settings, and kept for the life of the
 *   tree. Only `locale` is followed after that.
 * @param props - The catalogues, the locale, the settings and the subtree. `I18nProviderProps`
 *   documents every member.
 */
export function I18nProvider(props: I18nProviderProps): ReactElement {
  const { catalogues, children, configure, locale, options, plugins } = props;
  const [instance] = useState(() =>
    createI18n({ catalogues, configure, locale, options, plugins }),
  );

  useEffect(() => {
    if (instance.language !== locale) void instance.changeLanguage(locale);
  }, [instance, locale]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
