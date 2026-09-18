/**
 * The catalogues a shell specification hands the i18n provider.
 */

import { type Catalogues, NONE } from "@stealthscale/provider-i18n";

/**
 * One namespace in two languages, as the catalogue plugin would export it.
 */
export const CATALOGUES: Catalogues = {
  bundled: { en: { menu: { commands: "Commands" } }, nl: { menu: { commands: "Opdrachten" } } },
  defaults: { menu: { commands: "Commands" } },
  fallback: "en",
  languages: ["en", "nl"],
  load: NONE.load,
  namespaces: ["menu"],
};
