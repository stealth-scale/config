/**
 * Assigns the global i18next instance from the catalogues the plugin found, in the fallback
 * language.
 *
 * The runner loads this as a setup file. A component rendered outside a provider then reads real
 * strings rather than the key. The fallback language alone, because a specification asserting a
 * string asserts the one written beside the code.
 */

import { setI18n } from "react-i18next";
import { catalogues } from "virtual:i18n";

import { createI18n } from "#create-i18n.ts";

setI18n(createI18n({ catalogues, locale: catalogues.fallback }));
