/**
 * Writes the manifests a scratch workspace is built out of.
 *
 * @remarks
 *   Nothing here touches the disk. Each function returns file contents keyed by path, so a spec
 *   spreads several of them into one object and hands that to a workspace to write.
 */

import { type ScratchFiles } from "#scratch.ts";

/**
 * The fields a generated manifest declares.
 *
 * @remarks
 *   The index signature takes any further field and writes it through unread, so a misspelled
 *   `dependencies` reaches the manifest and the package manager that reads it stays quiet.
 */
export interface ManifestFields {
  /**
   * The name the package resolves under.
   */
  readonly name: string;

  /**
   * Any further manifest field, serialised as it is given.
   */
  readonly [field: string]: unknown;
}

/**
 * Serialises manifest fields as the JSON text a package manager reads.
 *
 * @remarks
 *   The version is `0.0.0` unless the fields carry one, which keeps a spec from declaring a version
 *   it does not care about. The text ends in a newline, so a spec may compare it to a file written
 *   by a formatter.
 */
export function manifest(fields: ManifestFields): string {
  return `${JSON.stringify({ version: "0.0.0", ...fields }, null, 2)}\n`;
}

/**
 * Places a package's manifest and the rest of its files under one directory.
 *
 * @remarks
 *   Every key in `files` is read as a path inside the package, and one that already names the
 *   directory nests it twice rather than failing.
 * @param directory - Where the package sits below the workspace root, without a trailing slash.
 * @param fields - The manifest fields for this package.
 * @param files - Further file contents, keyed by a path inside the package.
 * @returns Each file keyed by its path from the workspace root, the manifest first.
 */
export function packageFiles(
  directory: string,
  fields: ManifestFields,
  files: ScratchFiles = {},
): ScratchFiles {
  const entries: Array<[string, string]> = [
    [`${directory}/package.json`, manifest(fields)],
    ...Object.entries(files).map(([path, content]): [string, string] => [
      `${directory}/${path}`,
      content,
    ]),
  ];
  return Object.fromEntries(entries);
}

/**
 * Declares a workspace root over the globs its packages live under.
 *
 * @remarks
 *   The root is called `root` and marked private, so a spec cannot publish it by accident. The
 *   extra fields are merged over both, which is how a caller renames the root or adds a catalog.
 */
export function workspaceFiles(
  workspaces: readonly string[],
  fields: Readonly<Record<string, unknown>> = {},
): ScratchFiles {
  return {
    "package.json": manifest({
      name: "root",
      private: true,
      workspaces: [...workspaces],
      ...fields,
    }),
  };
}
