/**
 * Builds the manifests a scratch workspace needs.
 *
 * A root manifest carries the workspace globs. A package manifest carries the fields the code under
 * test reads.
 */

import { type ScratchFiles } from "#scratch.ts";

/**
 * The fields of a scratch manifest.
 *
 * Only `name` is required. Every other field is whatever the code under test reads.
 */
export interface ManifestFields {
  /**
   * Names the package.
   */
  readonly name: string;

  readonly [field: string]: unknown;
}

/**
 * Serialises a manifest the way a package manager writes one: two-space indentation and a final
 * newline.
 *
 * @param fields - The fields to write. `version` defaults to `0.0.0`.
 * @returns The JSON text.
 */
export function manifest(fields: ManifestFields): string {
  return `${JSON.stringify({ version: "0.0.0", ...fields }, null, 2)}\n`;
}

/**
 * Builds the files of one package under a directory: its manifest, and any other files at paths
 * relative to that directory.
 *
 * @param directory - The package's directory, relative to the workspace root.
 * @param fields - The fields to write into the manifest.
 * @param files - Other files of the package, relative to its directory. Default: none.
 * @returns Every file of the package, keyed relative to the workspace root.
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
 * Builds the root manifest of a workspace, which is private and named `root`.
 *
 * @param workspaces - The workspace globs: `core/*`, `tools/*`.
 * @param fields - Other root fields, such as a catalog or devDependencies. Default: none.
 * @returns The root `package.json`.
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
