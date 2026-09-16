/**
 * Renders the stylesheet an application imports: the font faces the themes named, then the
 * cascade order.
 */

import { layerDeclaration } from "#options.ts";
import { type StylesheetLayers } from "#pandacss.ts";

/**
 * Renders the stylesheet: one import per face, then the cascade order.
 *
 * @remarks
 *   A face is imported by the file it resolved to rather than by its package name. A dev server
 *   resolves a name through the plugin, and a build inlines the imports with a resolver that
 *   consults no plugin and fails on the name. A face nothing resolved is written by its name, so
 *   the failure says what was asked for. `faces` holds the file each font package resolved to, or
 *   the package's name where nothing resolved it.
 */
export function renderStylesheet(layers: StylesheetLayers, faces: readonly string[]): string {
  const imports = faces.map((face) => `@import ${JSON.stringify(face)};`);

  return [...imports, layerDeclaration(layers), ""].join("\n");
}
