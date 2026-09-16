import { describe, expect, it } from "vitest";

import { renderRuntimeConfig, renderStylesheetConfig, type StylesheetSource } from "#config.ts";
import { resolveOptions } from "#options.ts";

const FOUNDATION = { name: "@acme/design", theme: { extend: { tokens: {} } } };

const SOURCE: StylesheetSource = {
  base: "/node_modules/@pandacss/preset-base/dist/index.mjs",
  foundation: FOUNDATION,
  include: ["src/**/*.{ts,tsx}"],
  layers: resolveOptions().layers,
  presets: [
    { name: "@acme/kit", theme: { extend: { recipes: { button: { jsx: [/Button$/u] } } } } },
  ],
  system: "@acme/design",
  themes: {},
};

describe("config", () => {
  it("imports the base preset by the path given and installs the foundation after it", () => {
    const written = renderRuntimeConfig(SOURCE);

    expect(written).toContain(
      'import base from "/node_modules/@pandacss/preset-base/dist/index.mjs";',
    );
    expect(written).toContain('presets: [base, {"name": "@acme/design"');
  });

  it("scans nothing for the runtime", () => {
    expect(renderRuntimeConfig(SOURCE)).toContain("include: [],");
  });

  it("states the extension and the framework for both configurations", () => {
    for (const written of [renderRuntimeConfig(SOURCE), renderStylesheetConfig(SOURCE)]) {
      expect(written).toContain('outExtension: "mjs",');
      expect(written).toContain('jsxFramework: "react",');
      expect(written).toContain("forceImportExtension: true,");
      expect(written).toContain("patterns: {},");
    }
  });

  it("writes the layer names into both configurations", () => {
    const layers = resolveOptions({ layers: { reset: "acme-reset" } }).layers;

    expect(renderRuntimeConfig({ ...SOURCE, layers })).toContain('"reset": "acme-reset"');
    expect(renderStylesheetConfig({ ...SOURCE, layers })).toContain('"reset": "acme-reset"');
  });

  it("installs every preset after the foundation in the order given", () => {
    const written = renderStylesheetConfig(SOURCE);

    expect(written.indexOf('"@acme/design"')).toBeLessThan(written.indexOf('"@acme/kit"'));
  });

  it("writes a recipe's regular expression as one", () => {
    expect(renderStylesheetConfig(SOURCE)).toContain('"jsx": [/Button$/u]');
  });

  it("points the import map at the system package", () => {
    expect(renderStylesheetConfig(SOURCE)).toContain('"css": "@acme/design"');
  });

  it("scans the globs given and excludes fixtures and specifications", () => {
    const written = renderStylesheetConfig(SOURCE);

    expect(written).toContain('include: ["src/**/*.{ts,tsx}"]');
    expect(written).toContain('"**/*.spec.tsx"');
  });

  it("turns the reset and every optimisation on", () => {
    const written = renderStylesheetConfig(SOURCE);

    expect(written).toContain("preflight: true,");
    expect(written).toContain('"removeUnusedTokens": true');
    expect(written).toContain('"removeUnusedKeyframes": true');
    expect(written).toContain('"smartCompoundVariants": true');
  });

  it("states no static rule and no themes when the application has neither", () => {
    const written = renderStylesheetConfig(SOURCE);

    expect(written).not.toContain("staticCss");
    expect(written).not.toContain("themes:");
  });

  it("keeps the static rule the application stated", () => {
    const written = renderStylesheetConfig({ ...SOURCE, staticCss: { recipes: "*" } });

    expect(written).toContain('staticCss: {"recipes": "*"}');
  });

  it("writes every theme's variant and lists the names under the static rule", () => {
    const themes = { abyss: { tokens: {} }, fathom: { semanticTokens: {} } };
    const written = renderStylesheetConfig({ ...SOURCE, staticCss: { recipes: "*" }, themes });

    expect(written).toContain('staticCss: {"recipes": "*", "themes": ["abyss", "fathom"]}');
    expect(written).toContain(
      'themes: {"abyss": {"tokens": {}}, "fathom": {"semanticTokens": {}}}',
    );
  });

  it("throws with the path of a function inside a preset", () => {
    const presets = [{ name: "@acme/kit", utilities: { x: { transform: (): number => 1 } } }];

    expect(() => renderStylesheetConfig({ ...SOURCE, presets })).toThrow(
      "presets[2].utilities.x.transform is of kind function",
    );
  });
});
