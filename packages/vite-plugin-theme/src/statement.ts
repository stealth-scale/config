/**
 * Loads what an application states about its themes, and what a package publishes as its preset,
 * through Vite.
 *
 * @remarks
 *   Both are imported rather than parsed, because what they hold are live objects another package
 *   exported, which no amount of reading a file would reproduce. The import goes through an
 *   importer the caller opened under the application's export conditions, so a workspace package
 *   resolves to its source and a batch of imports shares one environment.
 */

import { join } from "node:path";

import { exportTarget, type Importer, manifestAt } from "@stealthscale/vite-plugin-base";

import { PRESET_SUBPATH, STATEMENT } from "#options.ts";
import { type Preset, type StaticCssOptions, type ThemeVariant } from "#pandacss.ts";
import { type Switchable } from "#scope.ts";

/**
 * Describes a theme as the package that defines one exports it.
 *
 * @remarks
 *   Declared here rather than imported. The package this type belongs to ships browser code, and
 *   such a package may not depend on build tooling, so the two agree structurally.
 */
export interface Theme extends Switchable {
  /**
   * The packages carrying the font faces the theme names.
   */
  fonts?: readonly string[] | undefined;

  /**
   * The theme's token values alone, for switching without a rebuild.
   */
  variant: ThemeVariant;
}

/**
 * Describes what an application states about styling.
 */
export interface Application {
  /**
   * The presets the application writes for recipes of its own, installed after every package's
   * preset and before the themes.
   */
  presets?: readonly object[] | undefined;

  /**
   * The recipes to compile outright, for a page that picks variants while it runs.
   */
  static?: "*" | StaticCssOptions | undefined;

  /**
   * The themes the page can wear. The first is the default.
   */
  themes: readonly [Theme, ...Theme[]];
}

/**
 * The module a statement or a preset turns out to be once imported.
 */
interface Module<Exported> {
  /**
   * The default export, or nothing where the module has none.
   */
  default?: Exported | undefined;
}

/**
 * Carries a loaded statement beside the files behind it.
 */
export interface Statement {
  /**
   * The application's statement.
   */
  application: Application;

  /**
   * Every file the statement's evaluation read, the statement first.
   */
  files: readonly string[];
}

/**
 * Carries a loaded preset beside the files behind it.
 */
export interface Published {
  /**
   * Every file the preset's evaluation read, its entry first.
   */
  files: readonly string[];

  /**
   * The preset the package published.
   */
  preset: Preset;
}

/**
 * Loads the application's statement from `root` through an importer.
 *
 * @throws {@link Error} When the statement cannot be evaluated or exports no default.
 */
export async function loadStatement(root: string, through: Importer): Promise<Statement> {
  const at = join(root, STATEMENT);
  const { files, module } = await through.import<Module<Application>>(at);

  if (module.default === undefined) throw new Error(`${at} exports no default`);

  return { application: module.default, files };
}

/**
 * Loads the preset a package publishes under its `./theme` subpath through an importer.
 *
 * @throws {@link Error} When the subpath cannot be evaluated or exports no default.
 */
export async function loadPreset(name: string, through: Importer): Promise<Published> {
  const specifier = `${name}${PRESET_SUBPATH.slice(1)}`;
  const { files, module } = await through.import<Module<Preset>>(specifier);

  if (module.default === undefined) throw new Error(`${specifier} exports no default`);

  return { files, preset: module.default };
}

/**
 * Finds the file a package publishes its own preset in, read from the export map of the manifest at
 * `root` under the conditions given.
 *
 * @remarks
 *   The system package loads its own preset by file rather than by name, because its own name is
 *   not among the packages an import from inside it resolves through.
 * @returns The file, absolute, or undefined where the manifest publishes no preset.
 */
export function presetEntry(root: string, conditions: readonly string[] = []): string | undefined {
  const found = exportTarget(manifestAt(root) ?? {}, PRESET_SUBPATH, conditions);

  return found === undefined ? undefined : join(root, found);
}

/**
 * Collects the packages carrying the font faces every theme named, once each, sorted.
 */
export function fontPackages(application: Application): readonly string[] {
  return [...new Set(application.themes.flatMap((each) => each.fonts ?? []))].toSorted();
}
