/**
 * Puts the locale and its catalogues in scope, and draws the catalogue under them.
 */

import { type ReactElement } from "react";

import { catalogues } from "virtual:i18n";
import { pages } from "virtual:specimen-index";

import { I18nProvider, LocaleProvider } from "@stealthscale/provider-locale";
import { Catalogue } from "@stealthscale/specimen";

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
 *   The application is the host. It settles the locale, loads the catalogues, and hands the pages
 *   the plugin indexed to the kit. Everything drawn below here belongs to `@stealthscale/specimen`,
 *   whose words this application can override by declaring the same key under `specimen`.
 */
export function App(): ReactElement {
  return (
    <LocaleProvider app={APP} locales={LOCALES}>
      <I18nProvider catalogues={catalogues}>
        <Catalogue listed={pages} />
      </I18nProvider>
    </LocaleProvider>
  );
}
