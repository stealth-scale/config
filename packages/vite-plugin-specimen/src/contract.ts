/**
 * Declares the types a catalogue reads out of the emitted modules, and the types the reader
 * produces on the way there.
 *
 * @remarks
 *   The plugin owns these because the plugin writes the modules. A kit that draws the pages imports
 *   them from here, so the dependency points one way.
 */

/**
 * Describes one specimen file as the reader receives it.
 */
export interface Source {
  /**
   * The absolute path of the file, with forward slashes.
   */
  path: string;

  /**
   * The unparsed text of the file.
   */
  text: string;
}

/**
 * Describes one page the reader parsed out of a file.
 */
export interface Entry {
  /**
   * The sentence the page opens with. Empty when the file declares none.
   */
  about: string;

  /**
   * The group a navigation rail lists the page under. Empty when the file declares none.
   */
  group: string;

  /**
   * The identifier the page is addressed by.
   */
  id: string;

  /**
   * The absolute path of the file, which the emitted loader imports.
   */
  path: string;

  /**
   * The page title. Derived from the last segment of the identifier when the file declares none.
   */
  title: string;
}

/**
 * Describes a file that matched a pattern and declares no page.
 */
export interface Refused {
  /**
   * The absolute path of the file, with forward slashes.
   */
  path: string;

  /**
   * The reason the file declares no page.
   */
  wrong: string;
}

/**
 * Describes the page a file declares, or the reason it declares none.
 */
export type Read = Entry | Refused;

/**
 * Describes the module a bundler returns for a file imported as text.
 */
export interface Raw {
  /**
   * The text of the file.
   */
  default: string;
}

/**
 * Describes the module the plugin returns for one page's scenes as source.
 */
export interface Fragments {
  /**
   * Each scene's source, keyed by the scene's title. A scene whose title the file does not declare
   * as a string literal has no entry.
   */
  fragments: Record<string, string>;
}

/**
 * Describes one page as the emitted index lists it.
 *
 * @remarks
 *   A file that declares no page is listed too, under its path, with the reason as its opening and
 *   a loader that rejects with the same reason. A dev server therefore keeps serving every other
 *   page while one file is half-written.
 */
export interface Indexed {
  /**
   * The sentence the page opens with. Empty when the file declares none.
   */
  about: string;

  /**
   * Loads each scene's source. Absent on a file that declares no page.
   */
  fragments?: (() => Promise<Fragments>) | undefined;

  /**
   * The group a navigation rail lists the page under. Empty when the file declares none.
   */
  group: string;

  /**
   * The identifier the page is addressed by.
   */
  id: string;

  /**
   * Loads the module that declares the scenes.
   *
   * @remarks
   *   A dynamic import, so the bundler emits one chunk per specimen and excludes its components
   *   from the chunk that holds the index. A rail that lists 100 pages therefore loads no
   *   component.
   */
  load: () => Promise<unknown>;

  /**
   * The name of the package the page's components are imported from. Empty when no manifest above
   * the file declares a name, and on a file that declares no page.
   */
  package: string;

  /**
   * The path of the file relative to the project root, with forward slashes on every platform.
   */
  path: string;

  /**
   * Loads the text of the file.
   */
  source: () => Promise<Raw>;

  /**
   * The page title. Derived from the last segment of the identifier when the file declares none.
   */
  title: string;
}
