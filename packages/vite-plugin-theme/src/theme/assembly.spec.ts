/**
 * Covers what an assembly compiles, against the real compiler: which theme applies unscoped, how
 * every theme's extensions and values are scoped, and what an edit changes.
 */

import { describe, expect, it } from "vitest";

import {
  manifest,
  packageFiles,
  type ScratchFiles,
  type ScratchWorkspace,
  withScratchWorkspaceAsync,
} from "@stealthscale/testing";

import { cleaned } from "#compiler.ts";
import { resolveOptions } from "#options.ts";
import { assemble } from "#theme/assembly.ts";

const RESOLVED = resolveOptions({ systemPackage: "@acme/design" });

const DESIGN = packageFiles(
  "node_modules/@acme/design",
  { exports: { ".": "./index.js", "./theme": "./theme.js" }, name: "@acme/design", type: "module" },
  {
    "index.js": "export {};\n",
    "theme.js":
      'export default { name: "@acme/design", theme: { extend: { tokens: { colors: { brand: { value: "#111" } } } } } };\n',
  },
);

const KIT = packageFiles(
  "node_modules/@acme/kit",
  { exports: { ".": "./index.js", "./theme": "./theme.js" }, name: "@acme/kit", type: "module" },
  {
    "index.js": "export {};\n",
    "theme.js": [
      "export default {",
      '  name: "@acme/kit",',
      "  theme: {",
      "    extend: {",
      '      recipes: { button: { className: "button", base: { color: "brand", letterSpacing: "0em" }, variants: { size: { lg: { padding: "8px" } } } } },',
      '      slotRecipes: { dialog: { className: "dialog", slots: ["content", "backdrop"], base: { content: { padding: "4px" } } } },',
      "    },",
      "  },",
      "};",
      "",
    ].join("\n"),
  },
);

function theme(name: string, extend: string, more = ""): string {
  return [
    `export const ${name} = {`,
    "  fonts: [],",
    `  name: "${name}",`,
    `  preset: { name: "${name}", theme: { extend: { ${extend} } } },`,
    `  variant: {${more}},`,
    "};",
    "",
  ].join("\n");
}

function tracking(em: string, more = ""): string {
  return `recipes: { button: { base: { letterSpacing: "${em}"${more} } } }`;
}

const APP: ScratchFiles = {
  ...DESIGN,
  ...KIT,
  "package.json": manifest({
    dependencies: { "@acme/design": "*", "@acme/kit": "*" },
    name: "@acme/app",
    type: "module",
  }),
  "src/page.tsx": 'export const Page = () => "page";\n',
  "theme.config.ts": [
    'import { abyss } from "./themes/abyss.ts";',
    'import { fathom } from "./themes/fathom.ts";',
    "",
    'export default { static: "*", themes: [fathom, abyss] };',
    "",
  ].join("\n"),
  "themes/abyss.ts": theme("abyss", tracking("0.06em")),
  "themes/fathom.ts": theme("fathom", tracking("0.01em")),
};

function declared(css: string, selector: string, property: string): string | undefined {
  const escaped = selector.replaceAll(/[.[\]]/gu, String.raw`\$&`);
  const pattern = new RegExp(`${escaped}\\s*\\{[^}]*?${property}:\\s*([^;}]+)`, "u");

  return pattern.exec(css)?.[1]?.trim();
}

async function compiled(workspace: ScratchWorkspace): Promise<string> {
  const { compiler } = await assemble({ root: workspace.root }, RESOLVED);

  return cleaned(compiler.driver.cssgen({ emitLayerDeclaration: false }).css);
}

describe("assemble", () => {
  it("draws the first theme where no attribute is set", async () => {
    const css = await withScratchWorkspaceAsync(APP, compiled);

    expect(declared(css, ".button", "letter-spacing")).toBe("0.01em");
  });

  it("draws every theme under the attribute that switches to it with the first included", async () => {
    const css = await withScratchWorkspaceAsync(APP, compiled);

    expect(declared(css, "[data-theme=abyss] .button", "letter-spacing")).toBe("0.06em");
    expect(declared(css, "[data-theme=fathom] .button", "letter-spacing")).toBe("0.01em");
  });

  it("draws a theme's token values under its attribute and names the compiler nowhere", async () => {
    const files = {
      ...APP,
      "themes/abyss.ts": theme(
        "abyss",
        tracking("0.06em"),
        ' tokens: { colors: { brand: { value: "#222" } } } ',
      ),
    };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, "[data-theme=abyss]", "--colors-brand")).toBe("#222");
    expect(css).not.toContain("panda");
  });

  it("scopes a variant's styles under the attribute", async () => {
    const extend = 'recipes: { button: { variants: { size: { lg: { padding: "12px" } } } } }';
    const files = { ...APP, "themes/abyss.ts": theme("abyss", extend) };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, ".button--size_lg", "padding")).toBe("8px");
    expect(declared(css, "[data-theme=abyss] .button--size_lg", "padding")).toBe("12px");
  });

  it("scopes a slot recipe's styles inside the slot", async () => {
    const extend = 'slotRecipes: { dialog: { base: { content: { padding: "16px" } } } }';
    const files = { ...APP, "themes/abyss.ts": theme("abyss", extend) };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, ".dialog__content", "padding")).toBe("4px");
    expect(declared(css, "[data-theme=abyss] .dialog__content", "padding")).toBe("16px");
  });

  it("scopes a derived theme's own and inherited extensions under its attribute", async () => {
    const files = {
      ...APP,
      "theme.config.ts": [
        'import { abyss } from "./themes/abyss.ts";',
        'import { deep } from "./themes/deep.ts";',
        'import { fathom } from "./themes/fathom.ts";',
        "",
        'export default { static: "*", themes: [fathom, abyss, deep] };',
        "",
      ].join("\n"),
      "themes/abyss.ts": theme("abyss", tracking("0.06em", ', fontWeight: "700"')),
      "themes/deep.ts": [
        'import { abyss } from "./abyss.ts";',
        "",
        "export const deep = {",
        "  fonts: [],",
        '  name: "deep",',
        '  preset: { name: "deep", presets: [abyss.preset], theme: { extend: { recipes: { button: { base: { letterSpacing: "0.09em" } } } } } },',
        "  variant: {},",
        "};",
        "",
      ].join("\n"),
    };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(declared(css, "[data-theme=deep] .button", "letter-spacing")).toBe("0.09em");
    expect(css).toMatch(/\[data-theme=deep\] \.button\s*\{[^}]*font-weight/u);
  });

  it("draws a theme's new value once that theme is edited", async () => {
    const css = await withScratchWorkspaceAsync(APP, async (workspace) => {
      await compiled(workspace);
      workspace.write({ "themes/abyss.ts": theme("abyss", tracking("0.3em")) });

      return compiled(workspace);
    });

    expect(declared(css, "[data-theme=abyss] .button", "letter-spacing")).toBe("0.3em");
  });

  it("stops scoping a theme that no longer extends anything", async () => {
    const files = {
      ...APP,
      "themes/abyss.ts": 'export const abyss = { fonts: [], name: "abyss", variant: {} };\n',
    };
    const css = await withScratchWorkspaceAsync(files, compiled);

    expect(css).not.toContain("data-theme=abyss");
  });

  it("lists the statement and the themes and the presets and the manifests as watched", async () => {
    const watched = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const assembled = await assemble({ root: workspace.root }, RESOLVED);

      return assembled.watched.map((file) => file.slice(workspace.root.length + 1)).toSorted();
    });

    expect(watched).toStrictEqual([
      "node_modules/@acme/design/package.json",
      "node_modules/@acme/design/theme.js",
      "node_modules/@acme/kit/package.json",
      "node_modules/@acme/kit/theme.js",
      "package.json",
      "theme.config.ts",
      "themes/abyss.ts",
      "themes/fathom.ts",
    ]);
  });

  it("places the system package first among the contributors", async () => {
    const names = await withScratchWorkspaceAsync(APP, async (workspace) => {
      const assembled = await assemble({ root: workspace.root }, RESOLVED);

      return assembled.contributors.map((each) => each.name);
    });

    expect(names).toStrictEqual(["@acme/design", "@acme/kit"]);
  });
});
