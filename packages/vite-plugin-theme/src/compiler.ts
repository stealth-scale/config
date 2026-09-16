/**
 * Starts the compiler on a rendered configuration, generates the runtime with it, and removes what
 * the compiler names itself in.
 *
 * @remarks
 *   The compiler's own driver scans the sources, generates the runtime, compiles the stylesheet
 *   and reports what to watch. It is handed a configuration file rather than left to search for
 *   one, because the file the plugin renders is the one it has to read.
 */

import { createNodeDriver, type NodeDriver } from "@pandacss/compiler";
import { createRequire } from "node:module";
import { dirname, join, resolve, sep } from "node:path";

import {
  emptyDir,
  exportTarget,
  manifestAt,
  syncDir,
  writeIfChanged,
} from "@stealthscale/vite-plugin-base";

import { CACHE, THEME_ATTRIBUTE } from "#options.ts";

/**
 * Marks a path that belongs to an installed package rather than to the workspace.
 */
const VENDOR = `${sep}node_modules${sep}`;

/**
 * Fixes where the compiler bundles a configuration before it reads it.
 *
 * @remarks
 *   The copy is deleted before the driver starts. A file both read and written in one task is one
 *   the task runner refuses to cache on, so the copy is written and never read, which makes it an
 *   output.
 */
const BUNDLE = join("node_modules", ".panda");

/**
 * Fixes where codegen writes the runtime before it is synced into the generated directory.
 *
 * @remarks
 *   Codegen writes every file whether or not its content changed. Writing into a scratch directory
 *   and syncing from there leaves an unchanged generated file as it was, so a watcher over the
 *   package sees the files a change reached and no others.
 */
const SCRATCH = join(CACHE, "runtime");

/**
 * Fixes the declaration written beside the recipe runtime, which the compiler emits without one.
 *
 * @remarks
 *   The runtime builds a recipe from what the compiler knows about it once its rules are in the
 *   stylesheet: the name, the class name, the slots, the values of each axis, the defaults and the
 *   compound variants. The declaration types that configuration from the generated recipe types,
 *   so the package binding a recipe states the variants it was written with and receives the
 *   runtime function typed the way the compiler's own `cva` and `sva` are. A compound carries the
 *   class its styles are emitted under, which the recipe names and the compiler honours.
 */
const RUNTIME_DECLARATION = [
  "/*",
  " * Declares the compiler's recipe runtime, which it emits without a declaration.",
  " */",
  "",
  "import type {",
  "  RecipeCompoundSelection,",
  "  RecipeConfigVariantMap,",
  "  RecipeRuntimeFn,",
  "  RecipeSelection,",
  "  RecipeVariantRecord,",
  "  SlotRecipeRuntimeFn,",
  "  SlotRecipeVariantRecord,",
  "  SlotRecord,",
  '} from "../types/recipe.d.mts";',
  'import type { SystemStyleObject } from "../types/system.d.mts";',
  "",
  "/**",
  " * What the runtime builds a recipe from, once the compiler has its rules in the stylesheet.",
  " */",
  "export interface RecipeRuntimeConfig<Variants extends RecipeVariantRecord> {",
  "  className?: string;",
  "  compoundVariants?: ReadonlyArray<",
  "    RecipeCompoundSelection<Variants> & { className?: string | undefined; css: SystemStyleObject }",
  "  >;",
  "  defaultVariants?: RecipeSelection<Variants>;",
  "  name: string;",
  "  variantMap?: RecipeConfigVariantMap<Variants>;",
  "}",
  "",
  "/**",
  " * What the runtime builds a slot recipe from: a recipe configuration and the slots it draws.",
  " */",
  "export interface SlotRecipeRuntimeConfig<",
  "  Slot extends string,",
  "  Variants extends SlotRecipeVariantRecord<Slot>,",
  "> {",
  "  className?: string;",
  "  compoundVariants?: ReadonlyArray<",
  "    RecipeCompoundSelection<Variants> & {",
  "      className?: string | undefined;",
  "      classNames?: SlotRecord<Slot, string> | undefined;",
  "      css: SlotRecord<Slot, SystemStyleObject>;",
  "    }",
  "  >;",
  "  defaultVariants?: RecipeSelection<Variants>;",
  "  name: string;",
  "  slots: readonly Slot[];",
  "  variantMap?: RecipeConfigVariantMap<Variants>;",
  "}",
  "",
  "export declare function createRecipe<Variants extends RecipeVariantRecord>(",
  "  config: RecipeRuntimeConfig<Variants>,",
  "): RecipeRuntimeFn<RecipeSelection<Variants>, RecipeConfigVariantMap<Variants>>;",
  "",
  "export declare function createSlotRecipe<",
  "  Slot extends string,",
  "  Variants extends SlotRecipeVariantRecord<Slot>,",
  ">(",
  "  config: SlotRecipeRuntimeConfig<Slot, Variants>,",
  "): SlotRecipeRuntimeFn<Slot, RecipeSelection<Variants>, RecipeConfigVariantMap<Variants>>;",
  "",
].join("\n");

/**
 * Matches the attribute the compiler emits a theme's values under, which its native binary fixes.
 */
const ATTRIBUTE = "[data-panda-theme=";

/**
 * Matches the signature the compiler writes on the root element on every compile.
 */
const SIGNATURE = /\s*--made-with-panda:[^;}]*;?/gu;

/**
 * Carries the running compiler beside the workspace files its configuration was built from.
 */
export interface Compiler {
  /**
   * Every file the configuration was bundled from that the workspace owns, absolute.
   *
   * @remarks
   *   Absolute because a watcher reports absolute paths while the compiler reports paths relative
   *   to the package. The workspace's own, because a configuration that reaches a library pulls in
   *   every module the library ships, and none of those can be edited.
   */
  dependencies: readonly string[];

  /**
   * The compiler's driver.
   */
  driver: NodeDriver;
}

/**
 * Starts the compiler on a configuration file.
 */
export async function startCompiler(root: string, configPath: string): Promise<Compiler> {
  emptyDir(join(root, BUNDLE));

  const driver = await createNodeDriver({ configPath, cwd: root });
  const dependencies = [...new Set(driver.configDependencies)]
    .map((path) => resolve(root, path))
    .filter((path) => !path.includes(VENDOR));

  return { dependencies, driver };
}

/**
 * Runs the compiler's codegen, declares what it leaves undeclared, and syncs the result into the
 * generated directory.
 *
 * @remarks
 *   Codegen runs into a scratch directory that is emptied first, so the sync sees exactly what
 *   this run wrote: a file the compiler stopped writing is deleted from the generated directory,
 *   and a file whose content did not change is left as it was.
 * @returns The compiler, for the files behind its configuration.
 */
export async function generateRuntime(
  root: string,
  configPath: string,
  outdir: string,
): Promise<Compiler> {
  const compiler = await startCompiler(root, configPath);
  const scratch = join(root, SCRATCH);

  emptyDir(scratch);
  compiler.driver.codegen({ cwd: root, outdir: scratch });
  writeIfChanged(join(scratch, "recipes", "runtime.d.mts"), RUNTIME_DECLARATION);
  syncDir(scratch, outdir);
  emptyDir(scratch);

  return compiler;
}

/**
 * Removes what the compiler names itself in from a compiled stylesheet: the theme attribute
 * becomes `data-theme`, and the signature on the root element goes.
 *
 * @remarks
 *   The compiler offers no option for either. Its `cssgen:done` hook receives the stylesheet, and
 *   what the hook returns is not what `cssgen` returns, so the edit is made here on what the plugin
 *   appends.
 */
export function cleaned(css: string): string {
  return css.replaceAll(ATTRIBUTE, `[${THEME_ATTRIBUTE}=`).replaceAll(SIGNATURE, "");
}

/**
 * Finds the directory the compiler's base preset is installed in beside this package.
 *
 * @throws {@link Error} When the preset is not installed beside this package.
 */
function installedBase(): string {
  return dirname(createRequire(import.meta.url).resolve("@pandacss/preset-base/package.json"));
}

/**
 * Resolves the module entry of the compiler's base preset, as an absolute path.
 *
 * @remarks
 *   The rendered configuration imports the preset by this path. It is read from a directory under
 *   the application's `node_modules` that resolves only what the application itself depends on,
 *   and the application depends on the plugin rather than on the preset. The directory is a
 *   parameter so a specification can hand in a manifest of its own.
 * @throws {@link Error} When the preset is not installed beside this package or publishes no entry.
 */
export function basePreset(at: string = installedBase()): string {
  const entry = exportTarget(manifestAt(at) ?? {}, ".", ["import"]);

  if (entry === undefined) throw new Error("@pandacss/preset-base publishes no entry");

  return join(at, entry);
}
