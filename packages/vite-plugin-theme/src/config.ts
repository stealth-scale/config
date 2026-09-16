/**
 * Renders the configurations the compiler reads, with every workspace value written as a literal.
 *
 * @remarks
 *   The compiler's loader bundles a configuration through Node's export conditions, which resolve
 *   a workspace package to built output. So nothing a rendered configuration imports comes from the
 *   workspace: every preset and every theme is written into it as data, and the one import it
 *   keeps is the compiler's base preset, by absolute path.
 */

import { literal } from "@stealthscale/vite-plugin-base";

import { type StaticCssOptions, type StylesheetLayers, type ThemeVariant } from "#pandacss.ts";

/**
 * Fixes the values both configurations share.
 *
 * @remarks
 *   `patterns: {}` beside `presets` replaces the base preset's patterns, so no pattern artefact is
 *   generated. `forceImportExtension` makes every relative import in the runtime name a file, so
 *   Node loads the runtime as generated. `outExtension` is stated because the compiler's default is
 *   `js` and the house packs `mjs`.
 */
const SHARED = {
  forceImportExtension: true,
  jsxFramework: "react",
  outExtension: "mjs",
  patterns: {},
};

/**
 * Fixes the files the compiler never scans, which are not the page.
 */
const EXCLUDED = ["**/*.fixtures.tsx", "**/*.spec.ts", "**/*.spec.tsx"];

/**
 * Describes what the runtime configuration is rendered from.
 */
export interface RuntimeSource {
  /**
   * The absolute path of the base preset's module.
   */
  base: string;

  /**
   * The foundation the system package publishes, written as data.
   */
  foundation: object;

  /**
   * The name each cascade layer goes by.
   */
  layers: StylesheetLayers;
}

/**
 * Describes what the stylesheet configuration is rendered from.
 */
export interface StylesheetSource extends RuntimeSource {
  /**
   * Globs the compiler scans, relative to the application.
   */
  include: readonly string[];

  /**
   * Every preset installed after the foundation, in the order the compiler installs them, each
   * written as data.
   */
  presets: readonly object[];

  /**
   * The rules to compile outright, or undefined for none.
   */
  staticCss?: StaticCssOptions | undefined;

  /**
   * The package every extracted call is matched against.
   */
  system: string;

  /**
   * Every theme's variant, keyed by the theme's name.
   */
  themes: Readonly<Record<string, ThemeVariant>>;
}

/**
 * Writes the lines of one module: the base preset import, then the default export.
 */
function rendered(base: string, presets: readonly object[], body: readonly string[]): string {
  const literals = presets.map((preset, index) => literal(preset, `presets[${String(index + 1)}]`));

  return [
    "/*",
    " * The compiler's configuration, rendered from what the workspace publishes and states.",
    " */",
    "",
    `import base from ${JSON.stringify(base)};`,
    "",
    "export default {",
    ...body,
    `  presets: [base, ${literals.join(", ")}],`,
    "};",
    "",
  ].join("\n");
}

/**
 * Writes one field of the default export, leaving out one whose value is undefined.
 */
function field(name: string, value: unknown): readonly string[] {
  return value === undefined ? [] : [`  ${name}: ${literal(value, name)},`];
}

/**
 * Renders the configuration the runtime is generated from.
 *
 * @remarks
 *   Nothing is scanned, because codegen reads the vocabulary alone.
 */
export function renderRuntimeConfig(source: RuntimeSource): string {
  return rendered(
    source.base,
    [source.foundation],
    [
      ...field("forceImportExtension", SHARED.forceImportExtension),
      ...field("include", []),
      ...field("jsxFramework", SHARED.jsxFramework),
      ...field("layers", source.layers),
      ...field("outExtension", SHARED.outExtension),
      ...field("patterns", SHARED.patterns),
    ],
  );
}

/**
 * Renders the configuration the stylesheet is compiled from.
 *
 * @remarks
 *   The optimisations are all on: a token is emitted whether or not anything reads it, and the
 *   foundation declares a whole vocabulary so a recipe has one to write against, so most of an
 *   unoptimised stylesheet is dead weight the browser parses. What `staticCss` names is exempt.
 *   The reset is on, because without it a browser's own defaults stand and none of them is
 *   anything a recipe can reach.
 * @throws {@link Error} When a preset or a theme carries a value that cannot be written as source.
 */
export function renderStylesheetConfig(source: StylesheetSource): string {
  const names = Object.keys(source.themes);
  const staticCss = names.length === 0 ? source.staticCss : { ...source.staticCss, themes: names };

  return rendered(
    source.base,
    [source.foundation, ...source.presets],
    [
      ...field("exclude", EXCLUDED),
      ...field("forceImportExtension", SHARED.forceImportExtension),
      ...field("importMap", [
        {
          css: source.system,
          jsx: source.system,
          patterns: source.system,
          recipes: source.system,
          tokens: source.system,
        },
      ]),
      ...field("include", source.include),
      ...field("jsxFramework", SHARED.jsxFramework),
      ...field("layers", source.layers),
      ...field("optimize", {
        removeUnusedKeyframes: true,
        removeUnusedTokens: true,
        smartCompoundVariants: true,
      }),
      ...field("outExtension", SHARED.outExtension),
      ...field("patterns", SHARED.patterns),
      ...field("preflight", true),
      ...field("staticCss", staticCss),
      ...field("themes", names.length === 0 ? undefined : source.themes),
    ],
  );
}
