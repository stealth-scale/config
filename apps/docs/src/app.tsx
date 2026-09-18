/**
 * Puts the locale and its catalogues in scope, and draws the catalogue under them.
 */

import { type ReactElement } from "react";

import { catalogues } from "virtual:i18n";

import { I18nProvider, LocaleProvider } from "@stealthscale/provider-locale";

import { Catalogue } from "#catalogue.tsx";

/**
 * The application the locale choice is remembered under, so another application on this origin
 * keeps its own.
 */
const APP = "docs";

/**
 * The locales the catalogue offers, the first being the one every key is defined in.
 */
const LOCALES: readonly [string, ...string[]] = ["en"];

/**
 * Draws the catalogue in the locale a reader chose.
 *
 * @remarks
 *   `LocaleProvider` writes `lang` and `dir` onto the document root, so a right-to-left locale
 *   turns the page without a component asking. `I18nProvider` reads the locale it settled on and
 *   hands the catalogues to i18next below it.
 */
export function App(): ReactElement {
  return (
    <LocaleProvider app={APP} locales={LOCALES}>
      <I18nProvider catalogues={catalogues}>
        <Catalogue />
      </I18nProvider>
    </LocaleProvider>
  );
}
