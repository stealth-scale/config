/**
 * Builds the i18next instance every `t` resolves against.
 *
 * @remarks
 *   The fallback language is bundled, every other language is fetched on first read, and a string
 *   changed during development is applied to the running instance.
 */

import {
  createInstance,
  type InitOptions,
  type i18n as Instance,
  type Module,
  type Newable,
  type Resource,
} from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";

import { type Catalogues, type Words } from "#catalogues.ts";

/**
 * The custom event name a changed catalogue arrives under.
 *
 * @remarks
 *   The catalogue plugin sends it and this package listens for it. Neither imports the other, so
 *   the name is a contract between them rather than a shared constant.
 */
export const CHANGED = "i18n:catalogue";

/**
 * The payload the change event carries.
 */
export interface Changed {
  /**
   * The BCP 47 tag of the language that changed.
   */
  language: string;

  /**
   * The namespace.
   */
  namespace: string;

  /**
   * Every file of the pair merged, which replaces the instance's current bundle.
   */
  words: Words;
}

/**
 * Carries what an application decides about i18next beyond the catalogues and the locale.
 */
export interface I18nSettings {
  /**
   * Runs on the initialised instance before anything reads it, for what no option covers: adding a
   * formatter, binding a listener, registering a post-processor.
   */
  configure?: ((instance: Instance) => void) | undefined;

  /**
   * I18next's own options, applied over the house defaults. A key set here wins, and an object such
   * as `interpolation` merges member by member. `resources`, `ns` and `lng` always come from the
   * catalogues, whatever this sets.
   */
  options?: InitOptions | undefined;

  /**
   * Modules the instance uses, in order, before its own backend: a language detector, a
   * post-processor, a formatter, or a message format such as ICU.
   */
  plugins?: ReadonlyArray<Module | Newable<Module>> | undefined;
}

/**
 * Everything `createI18n` needs.
 */
export interface I18nOptions extends I18nSettings {
  /**
   * The catalogues found, which is what `virtual:i18n` exports.
   */
  catalogues: Catalogues;

  /**
   * The BCP 47 tag to read in first.
   */
  locale: string;
}

/**
 * Returns true when a value is a plain object, which the merge descends into rather than replaces.
 *
 * @param value - Either side of a merge.
 */
function isPlain(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Applies an application's options over the house defaults, one level deep.
 *
 * @remarks
 *   An object on both sides merges member by member. Anything else the application sets replaces
 *   the default outright.
 * @param house - The house defaults.
 * @param application - The application's options, or undefined.
 */
function layered(house: InitOptions, application: InitOptions | undefined): InitOptions {
  const result: Record<string, unknown> = { ...house };

  for (const [key, value] of Object.entries(application ?? {})) {
    const existing = result[key];

    result[key] = isPlain(value) && isPlain(existing) ? { ...existing, ...value } : value;
  }

  return result;
}

/**
 * Copies the bundled contents, and registers an empty bundle for a locale with no catalogue.
 *
 * @remarks
 *   A locale such as `en-US` over catalogues in `en` has nothing to fetch, but a fetch resolving to
 *   undefined still suspends every component for a tick before falling through to the fallback. An
 *   empty bundle reads as already loaded, so the first paint has its strings. The copy is needed
 *   because i18next writes into what it is given and the next instance reads the catalogues again.
 * @param catalogues - The catalogues found.
 * @param locale - The locale read first.
 */
function bundledFor(catalogues: Catalogues, locale: string): Resource {
  const resources: Resource = structuredClone(catalogues.bundled);

  if (!catalogues.languages.includes(locale)) {
    resources[locale] = Object.fromEntries(
      catalogues.namespaces.map((namespace) => [namespace, {}]),
    );
  }

  return resources;
}

/**
 * Replaces one pair's bundle on the instance, so every component reading it re-renders.
 *
 * @remarks
 *   Replaced rather than merged, because the payload carries every string of the pair and a string
 *   removed from the catalogue is meant to disappear.
 * @param instance - The instance to write into.
 * @param changed - The pair and its new contents.
 */
export function applied(instance: Instance, changed: Changed): void {
  instance.removeResourceBundle(changed.language, changed.namespace);
  instance.addResourceBundle(changed.language, changed.namespace, changed.words, false, true);
}

/**
 * The one method this package calls on the dev server's channel.
 */
export interface Channel {
  /**
   * Registers a listener called with the payload each time the event is sent.
   */
  on: (event: string, listen: (changed: Changed) => void) => void;
}

/**
 * Subscribes the instance to catalogue changes from the dev server.
 *
 * @param instance - The instance to apply each change to.
 * @param channel - The dev server's channel, or undefined in a build.
 */
export function heard(instance: Instance, channel?: Channel): void {
  channel?.on(CHANGED, (changed) => {
    applied(instance, changed);
  });
}

/**
 * Builds and initialises the i18next instance for one set of catalogues and one locale.
 *
 * @remarks
 *   The fallback language is bundled, so `t` resolves as soon as this returns. Every other
 *   namespace is fetched on first read and suspends the component until it arrives. A missing key
 *   falls back down the tag, `nl-BE` to `nl` to the fallback. Nothing is escaped, because React
 *   escapes it. An application's `options` can restate any of these.
 *   The instance is not registered globally, so a tree without `I18nProvider` reads nothing rather
 *   than whichever instance was built last.
 * @param settings - The catalogues, the locale, and the application's own options. `I18nOptions`
 *   documents every member.
 */
export function createI18n(settings: I18nOptions): Instance {
  const { catalogues, configure, locale, options, plugins = [] } = settings;
  const house: InitOptions = {
    defaultNS: false,
    fallbackLng: catalogues.fallback,
    interpolation: { escapeValue: false },
    partialBundledLanguages: true,
    react: { bindI18nStore: "added", useSuspense: true },
    returnNull: false,
  };
  const instance = createInstance({
    ...layered(house, options),
    lng: locale,
    ns: [...catalogues.namespaces],
    resources: bundledFor(catalogues, locale),
  });

  for (const plugin of plugins) instance.use(plugin);
  // No catalogues, nothing to fetch: without a backend every namespace counts as loaded, so a
  // component reads its keys at once rather than waiting on a fetch that answers nothing.
  if (catalogues.namespaces.length > 0) instance.use(resourcesToBackend(catalogues.load));
  void instance.init();
  configure?.(instance);
  heard(instance, import.meta.hot);

  return instance;
}
