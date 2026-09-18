/**
 * What the catalogue plugin emits, declared so that importing it type-checks.
 *
 * @remarks
 *   An application reaches this with a triple-slash directive naming
 *   `@stealthscale/vite-plugin-i18n/client`, from a file it already compiles. The module exists
 *   only in a build the plugin takes part in.
 */

declare module "virtual:i18n" {
  /**
   * Describes what one catalogue holds: keys to words, nested as deep as the author likes.
   */
  export interface Words {
    readonly [key: string]: string | Words;
  }

  /**
   * Describes the catalogues an application loads its words from.
   */
  export interface Catalogues {
    /**
     * The words inlined, by language then namespace: the fallback language's, or every language's
     * where the plugin was told to be eager.
     */
    readonly bundled: Readonly<Record<string, Readonly<Record<string, Words>>>>;

    /**
     * The fallback language's words, every namespace merged, inlined so the first paint has them.
     */
    readonly defaults: Readonly<Record<string, Words>>;

    /**
     * The language every key is defined in.
     */
    readonly fallback: string;

    /**
     * Every language a catalogue was found for.
     */
    readonly languages: readonly string[];

    /**
     * Loads one language's namespace, every file naming the pair merged, or nothing where none
     * does.
     */
    readonly load: (language: string, namespace: string) => Promise<undefined | Words>;

    /**
     * Every namespace found.
     */
    readonly namespaces: readonly string[];
  }

  /**
   * The catalogues found.
   */
  export const catalogues: Catalogues;
}
