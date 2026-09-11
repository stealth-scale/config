/**
 * Working out where another application's files are from the manifest its build wrote.
 */

/**
 * Describes where another application's entry and its stylesheets are.
 */
export interface Remote {
  /**
   * The stylesheets the entry needs, which the host adds to its own page. A host that loads the
   * script and not these gets the application drawn without any of its styling.
   */
  styles: readonly string[];

  /**
   * The module to import, as an absolute URL.
   */
  url: string;
}

/**
 * Reads a chunk's field, whatever else the manifest holds.
 *
 * @param chunk - One entry of the manifest.
 * @param named - The field to read.
 * @returns The value, or nothing where the field is absent or the wrong shape.
 */
function field(chunk: unknown, named: string): unknown {
  return typeof chunk === "object" && chunk !== null ? Reflect.get(chunk, named) : undefined;
}

/**
 * Finds another application's entry in the manifest its build wrote.
 *
 * Every file a build emits carries a content hash, so its name changes whenever its contents do and
 * nothing outside the build can guess it. That is what makes the output cacheable forever, and it
 * is also why a host cannot simply hard-code the URL of what it loads: the name it wrote down stops
 * existing the next time the other application is built.
 *
 * The manifest is the build's own answer to that. It maps the source path — which does not change —
 * to the hashed file it became, and marks the ones that are entries. A host reads it at run time
 * and gets a URL that is right for whatever was deployed.
 *
 * The URLs come back absolute, resolved against where the other application says it is served from.
 * A host and a remote are two origins, so a path on its own would be read as a path on the host.
 *
 * @param manifest - The manifest, as the other application's build wrote it.
 * @param at - The URL that application serves its files from, ending in a slash.
 * @returns Where its entry is, and what to load beside it.
 * @throws Error Where the manifest marks no entry, which means it is not one a host can load.
 */
export function remote(manifest: object, at: string): Remote {
  for (const source of Object.keys(manifest)) {
    const chunk: unknown = Reflect.get(manifest, source);

    if (field(chunk, "isEntry") !== true) continue;

    const file: unknown = field(chunk, "file");

    if (typeof file !== "string") continue;

    const styles: unknown = field(chunk, "css");

    return {
      styles: (Array.isArray(styles) ? styles : [])
        .filter((one): one is string => typeof one === "string")
        .map((one) => new URL(one, at).href),
      url: new URL(file, at).href,
    };
  }

  throw new Error(
    `remote(${at}) found no entry in that manifest. A build marks the chunk a page loads with ` +
      "`isEntry`, and one with none is a library's manifest rather than an application's.",
  );
}
