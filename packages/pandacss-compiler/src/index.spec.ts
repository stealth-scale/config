import { createNodeDriver } from "@pandacss/compiler";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { parse } from "postcss";
import selectorParser from "postcss-selector-parser";
import { describe, expect, it } from "vitest";

import { type CompilerConfig } from "@stealthscale/pandacss-naming";

import * as published from "#index.ts";
import { compilerConfig, type Renamed, renameSelectors, rewriteRuntime } from "#index.ts";

const SURFACE = ["compilerConfig", "renameSelectors", "rewriteRuntime"];

const PACKAGE = join(import.meta.dirname, "..");

const require = createRequire(import.meta.url);

const BASE = join(
  dirname(require.resolve("@pandacss/preset-base/package.json")),
  "dist",
  "index.mjs",
);

const STYLES = {
  _child: { marginBlock: "4" },
  _focusVisible: { color: "red" },
  "& > *": { flexShrink: 0 },
  fontFamily: "Segoe UI, sans-serif",
  gridAutoRows: "{sizes.32}",
  marginTop: "-4",
  md: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" },
};

const PANDA = [
  `import base from "${BASE}";`,
  "",
  "export default {",
  '  conditions: { extend: { child: "& > *" } },',
  "  forceImportExtension: true,",
  '  importMap: { css: "design/css", jsx: "design/jsx", patterns: "design/patterns", recipes: "design/recipes", tokens: "design/tokens" },',
  '  include: ["./src/**/*.tsx"],',
  '  outdir: "generated",',
  '  outExtension: "mjs",',
  "  preflight: false,",
  "  presets: [base],",
  "  theme: {",
  "    extend: {",
  '      breakpoints: { md: "48rem" },',
  '      recipes: { button: { base: { display: "inline-flex" }, className: "button", compoundVariants: [{ className: "button--expose.all", css: { fontWeight: "700" }, loading: true, size: "lg" }], variants: { loading: { false: { opacity: "1" }, true: { opacity: "0.5" } }, size: { lg: { padding: "8px" }, sm: { padding: "4px" } } } } },',
  '      slotRecipes: { card: { base: { content: { padding: "4px" }, root: { display: "grid" } }, className: "card", slots: ["root", "content"], variants: { bleed: { true: { content: { margin: "-4px" }, root: { overflow: "hidden" } } } } } },',
  '      tokens: { sizes: { 32: { value: "8rem" } } },',
  "    },",
  "  },",
  "};",
  "",
].join("\n");

const PAGE = [
  'import { css } from "design/css";',
  'import { button, card } from "design/recipes";',
  "",
  `export const styles = css(${JSON.stringify(STYLES)});`,
  'export const exposed = button({ loading: true, size: "lg" });',
  'export const plain = button({ loading: false, size: "sm" });',
  "export const bled = card({ bleed: true });",
  "",
].join("\n");

interface Css {
  css: (styles: object) => string;
}

interface Recipes {
  button: (props: object) => string;
  card: (props: object) => Record<string, string>;
}

interface Outcome {
  bled: Record<string, string>;
  config: CompilerConfig;
  exposed: string;
  plain: string;
  sheet: Renamed;
  styles: string;
}

function isCss(value: unknown): value is Css {
  return (
    typeof value === "object" && value !== null && "css" in value && typeof value.css === "function"
  );
}

function isRecipes(value: unknown): value is Recipes {
  return (
    typeof value === "object" &&
    value !== null &&
    "button" in value &&
    typeof value.button === "function" &&
    "card" in value &&
    typeof value.card === "function"
  );
}

function loaded<Module>(file: string, guard: (value: unknown) => value is Module): Module {
  const module: unknown = require(file);

  if (!guard(module)) throw new Error(`${file} is not the module the specification expects`);

  return module;
}

function classesOf(css: string): Set<string> {
  const found = new Set<string>();
  const collect = selectorParser((selectors) => {
    selectors.walkClasses((node) => {
      found.add(node.value);
    });
  });

  parse(css).walkRules((rule) => {
    if (rule.selector.includes(".")) collect.processSync(rule.selector);
  });

  return found;
}

function tokens(classes: string): string[] {
  return classes.split(" ").toSorted();
}

async function compiled(): Promise<Outcome> {
  const dir = mkdtempSync(join(PACKAGE, "node_modules", ".pandacss-compiler-"));

  try {
    const generated = join(dir, "generated");

    mkdirSync(join(dir, "src"));
    writeFileSync(join(dir, "panda.config.mjs"), PANDA);
    writeFileSync(join(dir, "src", "page.tsx"), PAGE);

    const driver = await createNodeDriver({ configPath: "panda.config.mjs", cwd: dir });

    driver.parseFiles();
    driver.codegen({ cwd: dir, outdir: generated });

    const config = compilerConfig(driver.config);

    rewriteRuntime(generated, config.separator);

    const sheet = renameSelectors(driver.cssgen().css, config);
    const { css } = loaded(join(generated, "css", "index.mjs"), isCss);
    const { button, card } = loaded(join(generated, "recipes", "index.mjs"), isRecipes);

    return {
      bled: card({ bleed: true }),
      config,
      exposed: button({ loading: true, size: "lg" }),
      plain: button({ loading: false, size: "sm" }),
      sheet,
      styles: css(STYLES),
    };
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
}

describe("pandacss-compiler", () => {
  it("publishes the two rewrites and the configuration reader", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });

  it("reads the recipes and the separator out of the driver's configuration", async () => {
    const { config } = await compiled();

    expect(config).toStrictEqual({
      recipes: [
        { axes: ["loading", "size"], className: "button" },
        { axes: ["bleed"], className: "card", slots: ["root", "content"] },
      ],
      separator: "_",
    });
  });

  it("writes every class the browser writes as a selector in the renamed stylesheet", async () => {
    const outcome = await compiled();
    const selectors = classesOf(outcome.sheet.css);
    const written = [
      ...tokens(outcome.styles),
      ...tokens(outcome.exposed),
      ...tokens(outcome.plain),
      ...Object.values(outcome.bled).flatMap((classes) => tokens(classes)),
    ];

    expect(written.filter((each) => !selectors.has(each))).toStrictEqual([]);
  });

  it("writes an atomic class in the scheme at run time", async () => {
    const { styles } = await compiled();

    expect(tokens(styles)).toStrictEqual(
      tokens(
        "[&_>_*]:flex-sh-0 child:my-4 focus-visible:c-red ff-Segoe-UI-sans-serif grid-ar-sizes-32 md:grid-tc-repeat-3-minmax-0-1fr mt--4",
      ),
    );
  });

  it("writes a recipe's classes in the scheme at run time", async () => {
    const { bled, exposed, plain } = await compiled();

    expect(tokens(exposed)).toStrictEqual(
      tokens("button button--expose-all button--lg button--loading"),
    );
    expect(tokens(plain)).toStrictEqual(tokens("button button--sm"));
    expect(bled).toStrictEqual({
      content: "card__content card__content--bleed",
      root: "card__root card__root--bleed",
    });
  });

  it("removes the rule for a boolean axis at false from the stylesheet", async () => {
    const { sheet } = await compiled();

    expect(sheet.css).not.toContain("loading-false");
    expect(sheet.css).not.toContain("loading-true");
    expect(classesOf(sheet.css).has("button--loading")).toBe(true);
  });

  it("reports the styled false branch and the raw condition the page wrote and nothing else", async () => {
    const { sheet } = await compiled();

    expect(sheet.diagnostics.map((each) => each.code)).toStrictEqual([
      "naming/unreachable",
      "naming/raw-condition",
    ]);
    expect(sheet.diagnostics.map((each) => each.help)).toStrictEqual([
      ["button--loading_false"],
      ["[&_>_*]:flex-sh_0"],
    ]);
  });
});
