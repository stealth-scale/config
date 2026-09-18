import { type Catalogues, type Words } from "#catalogues.ts";

/**
 * The words in English: every key defined.
 */
const ENGLISH: Readonly<Record<string, Words>> = {
  overlays: {
    commands: "Commands",
    menu: "Menu",
    nested: { close: "Close {{what}}" },
    pages_one: "{{count}} page",
    pages_other: "{{count}} pages",
  },
  site: { shouted: "{{name, shout}}", welcome: "Welcome to {{name}}" },
};

/**
 * The words in Dutch, fetched when first read: one namespace translated in full but for one key,
 * the other not at all.
 */
const DUTCH: Readonly<Record<string, Words>> = {
  overlays: { commands: "Opdrachten", nested: { close: "Sluit {{what}}" } },
};

/**
 * Two namespaces in English, and the same fetched in Dutch: what an application with the plugin
 * imports from `virtual:i18n`, kept small enough to assert against.
 */
export const SMALL: Catalogues = {
  bundled: { en: ENGLISH },
  defaults: ENGLISH,
  fallback: "en",
  languages: ["en", "nl"],
  load: (language, namespace) => Promise.resolve(language === "nl" ? DUTCH[namespace] : undefined),
  namespaces: ["overlays", "site"],
};

/**
 * The same catalogues with every language inlined, which is what the plugin exports under eager.
 */
export const EAGER: Catalogues = {
  ...SMALL,
  bundled: { en: ENGLISH, nl: DUTCH },
  load: () => Promise.reject(new Error("nothing is fetched when eager")),
};
