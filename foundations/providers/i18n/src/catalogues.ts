/**
 * The shape `virtual:i18n` exports, declared here so a specification or an application without the
 * plugin can supply one by hand.
 */

/**
 * The contents of one catalogue: keys mapped to strings, nested to any depth.
 */
export interface Words {
  readonly [key: string]: string | Words;
}

/**
 * The catalogues an application loads its strings from.
 */
export interface Catalogues {
  /**
   * The inlined contents, by language then namespace. Holds the fallback language alone unless the
   * plugin ran with `eager`.
   */
  readonly bundled: Readonly<Record<string, Readonly<Record<string, Words>>>>;

  /**
   * The fallback language's contents, by namespace, inlined for the first paint.
   */
  readonly defaults: Readonly<Record<string, Words>>;

  /**
   * The BCP 47 tag of the language that defines every key.
   */
  readonly fallback: string;

  /**
   * Every language a catalogue was found for.
   */
  readonly languages: readonly string[];

  /**
   * Fetches one language's namespace, every file of the pair merged.
   */
  readonly load: (language: string, namespace: string) => Promise<undefined | Words>;

  /**
   * Every namespace found.
   */
  readonly namespaces: readonly string[];
}

/**
 * Catalogues holding nothing, for an application the plugin never ran in.
 *
 * @remarks
 *   Every key then resolves to itself, so a component renders the key rather than an empty string.
 */
export const NONE: Catalogues = {
  bundled: {},
  defaults: {},
  fallback: "en",
  languages: [],
  // eslint-disable-next-line unicorn/no-useless-undefined -- the loader resolves to words or undefined
  load: () => Promise.resolve<undefined | Words>(undefined),
  namespaces: [],
};
