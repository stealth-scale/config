/**
 * Fixes the options a repository can state, the defaults behind them, and the names every generated
 * file goes by.
 *
 * @remarks
 *   The three options are the facts about a repository that differ between one and the next. What
 *   a file is called and where a generated file goes are conventions, so they are constants: a
 *   repository that renamed one would have two ways of writing the same thing.
 */

import { type StylesheetLayers } from "#pandacss.ts";

/**
 * Fixes the directory, under an application or the system package, where generated files go.
 */
export const CACHE = "node_modules/.theme";

/**
 * Fixes the file an application states its themes in.
 */
export const STATEMENT = "theme.config.ts";

/**
 * Fixes the directory, under the system package, where the generated runtime goes.
 *
 * @remarks
 *   The house ignores `generated/` in formatting and coverage, so the runtime needs no layer of
 *   its own to be left alone.
 */
export const GENERATED = "generated";

/**
 * Fixes the subpath a package publishes its preset under.
 */
export const PRESET_SUBPATH = "./theme";

/**
 * Fixes the attribute the compiled stylesheet switches a theme under, on the document root or on
 * any element for a subtree.
 *
 * @remarks
 *   The compiler emits every theme under an attribute of its own naming, and the plugin rewrites it
 *   to this one, so nothing a page sees names the compiler. The design-system package publishes the
 *   same name for a provider to write.
 */
export const THEME_ATTRIBUTE = "data-theme";

/**
 * Lists the cascade layers in the order the compiler writes them, whatever they are named.
 *
 * @remarks
 *   The compiler writes each kind of rule into a layer by role, so a stylesheet declaring another
 *   order would put rules where the compiler did not write them.
 */
const LAYER_ORDER: ReadonlyArray<keyof StylesheetLayers> = [
  "reset",
  "base",
  "tokens",
  "recipes",
  "utilities",
];

/**
 * Fixes the design-system package of this workspace.
 */
const SYSTEM = "@stealthscale/theme";

/**
 * Fixes what every option means when a repository states nothing.
 */
const DEFAULTS: Omit<Resolved, "stylesheet"> = {
  include: ["src/**/*.{ts,tsx}"],
  layers: {
    base: "base",
    recipes: "recipes",
    reset: "reset",
    tokens: "tokens",
    utilities: "utilities",
  },
  systemPackage: SYSTEM,
};

/**
 * Describes what a repository can state instead of a default.
 */
export interface Options {
  /**
   * Globs the compiler scans, relative to the application, beside the source of every workspace
   * package the application depends on.
   *
   * @defaultValue `["src/**\/*.{ts,tsx}"]`
   */
  include?: readonly string[] | undefined;

  /**
   * The name each cascade layer goes by.
   *
   * @remarks
   *   One answer drives two things that have to agree: the layer the compiler writes each kind of
   *   rule into, and the layer the stylesheet declares. An application embedded in a page that
   *   already uses one of these names renames it here and both follow.
   * @defaultValue Each role's own name
   */
  layers?: Partial<StylesheetLayers> | undefined;

  /**
   * The package that publishes the foundation and generates the runtime.
   *
   * @defaultValue `@stealthscale/theme`
   */
  systemPackage?: string | undefined;
}

/**
 * Describes what the design-system package can state, which is the layer names alone.
 *
 * @remarks
 *   The runtime is generated from the package's own preset, so the globs an application scans and
 *   the name of the system package mean nothing there.
 */
export type RuntimeOptions = Pick<Options, "layers">;

/**
 * Carries the options with every default filled in.
 */
export interface Resolved {
  /**
   * Globs the compiler scans, relative to the application.
   */
  include: readonly string[];

  /**
   * The name each cascade layer goes by.
   */
  layers: StylesheetLayers;

  /**
   * The specifier an application imports to load its stylesheet.
   */
  stylesheet: string;

  /**
   * The package that publishes the foundation and generates the runtime.
   */
  systemPackage: string;
}

/**
 * Fills in every option a repository did not state.
 *
 * @remarks
 *   The stylesheet specifier is derived from the system package, so a repository that renames the
 *   package renames the import with it.
 */
export function resolveOptions(options: Options = {}): Resolved {
  const systemPackage = options.systemPackage ?? DEFAULTS.systemPackage;

  return {
    include: options.include ?? DEFAULTS.include,
    layers: { ...DEFAULTS.layers, ...options.layers },
    stylesheet: `${systemPackage}/styles.css`,
    systemPackage,
  };
}

/**
 * Writes the at-rule that declares the cascade order.
 *
 * @remarks
 *   The at-rule is also what a stylesheet is recognised by: the file declaring the order is the
 *   file the compiled rules are appended to.
 * @returns The at-rule, ending in a semicolon.
 */
export function layerDeclaration(layers: StylesheetLayers): string {
  return `@layer ${LAYER_ORDER.map((role) => layers[role]).join(", ")};`;
}

/**
 * Escapes the characters of a layer name that a regular expression would read as syntax.
 */
function escaped(name: string): string {
  return name.replaceAll(/[$()*+.?[\\\]^{|}]/gu, String.raw`\$&`);
}

/**
 * Builds the pattern that recognises the at-rule declaring the cascade order, however it is spaced.
 *
 * @remarks
 *   The at-rule is what a stylesheet is recognised by, and a formatter or a minifier decides the
 *   spacing around its commas. The pattern reads the names alone, so a sheet written as
 *   `@layer reset,base,tokens,recipes,utilities;` is recognised beside one written with spaces.
 */
export function layerPattern(layers: StylesheetLayers): RegExp {
  const names = LAYER_ORDER.map((role) => escaped(layers[role]));

  return new RegExp(String.raw`@layer\s+${names.join(String.raw`\s*,\s*`)}\s*;`, "u");
}
