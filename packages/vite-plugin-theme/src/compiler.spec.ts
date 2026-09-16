import { existsSync, statSync, utimesSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { manifest, withScratchWorkspace, withScratchWorkspaceAsync } from "@stealthscale/testing";

import { basePreset, cleaned, generateRuntime, startCompiler } from "#compiler.ts";

const CONFIG = [
  `import base from ${JSON.stringify(basePreset())};`,
  "",
  "export default {",
  "  forceImportExtension: true,",
  '  include: ["src/**/*.ts"],',
  '  jsxFramework: "react",',
  '  outExtension: "mjs",',
  "  patterns: {},",
  '  presets: [base, { name: "@acme/design", theme: { extend: { tokens: { colors: { brand: { value: "#123" } } } } } }],',
  "};",
  "",
].join("\n");

const SYSTEM = {
  "node_modules/.theme/runtime.config.mjs": CONFIG,
  "package.json": manifest({ name: "@acme/design", type: "module" }),
  "src/x.ts": "export const x = 1;\n",
};

function entryOf(exports?: unknown): string | undefined {
  return withScratchWorkspace(
    { "package.json": manifest({ exports, name: "@pandacss/preset-base" }) },
    (workspace) => basePreset(workspace.root).slice(workspace.root.length + 1),
  );
}

describe("compiler", () => {
  it("renames the theme attribute in a stylesheet", () => {
    expect(cleaned('[data-panda-theme="forge"] { --colors-primary: red; }')).toBe(
      '[data-theme="forge"] { --colors-primary: red; }',
    );
  });

  it("removes the signature from a stylesheet however it is spaced", () => {
    const css = [
      "@layer base {",
      "  :root {",
      "    --made-with-panda: '🐼';",
      "  }",
      "  :root{--made-with-panda:'🐼'}",
      "}",
    ].join("\n");

    expect(cleaned(css)).toBe(["@layer base {", "  :root {", "  }", "  :root{}", "}"].join("\n"));
  });

  it("resolves the installed base preset to a module file that exists", () => {
    expect(basePreset()).toMatch(/@pandacss[/\\]preset-base[/\\].*\.mjs$/u);
    expect(existsSync(basePreset())).toBe(true);
  });

  it("reads the entry under the import condition and then under default", () => {
    expect(entryOf({ ".": { import: { default: "./dist/index.mjs" } } })).toBe("dist/index.mjs");
    expect(entryOf({ ".": { default: "./dist/index.js" } })).toBe("dist/index.js");
    expect(entryOf({ ".": "./index.js" })).toBe("index.js");
  });

  it("throws when the preset publishes no entry", () => {
    expect(() => entryOf({ ".": 3 })).toThrow("@pandacss/preset-base publishes no entry");
    expect(() => entryOf()).toThrow("@pandacss/preset-base publishes no entry");
  });

  it("throws when the preset has no manifest", () => {
    expect(() => withScratchWorkspace({}, (workspace) => basePreset(workspace.root))).toThrow(
      "@pandacss/preset-base publishes no entry",
    );
  });

  it("starts the compiler on the configuration it is handed", async () => {
    const brand = await withScratchWorkspaceAsync(SYSTEM, async (workspace) => {
      const { driver } = await startCompiler(
        workspace.root,
        workspace.path("node_modules/.theme/runtime.config.mjs"),
      );

      return driver.compiler.spec().tokens.values["colors.brand"];
    });

    expect(brand).toBe("#123");
  });

  it("lists the workspace files behind the configuration and no installed one", async () => {
    const dependencies = await withScratchWorkspaceAsync(SYSTEM, async (workspace) => {
      const { dependencies: found } = await startCompiler(
        workspace.root,
        workspace.path("node_modules/.theme/runtime.config.mjs"),
      );

      return found.map((file) => file.slice(workspace.root.length + 1));
    });

    expect(dependencies).toStrictEqual([]);
  });

  it("generates the runtime and removes a file the compiler no longer writes", async () => {
    const files = await withScratchWorkspaceAsync(
      { ...SYSTEM, "generated/stale.txt": "" },
      async (workspace) => {
        await generateRuntime(
          workspace.root,
          workspace.path("node_modules/.theme/runtime.config.mjs"),
          workspace.path("generated"),
        );

        return workspace.files().filter((file) => file.startsWith("generated/"));
      },
    );

    expect(files).not.toContain("generated/stale.txt");
    expect(files).toContain("generated/css/index.mjs");
    expect(files).toContain("generated/jsx/index.mjs");
    expect(files).toContain("generated/recipes/runtime.mjs");
    expect(files).toContain("generated/recipes/runtime.d.mts");
  });

  it("declares the recipe runtime from the generated recipe types", async () => {
    const declared = await withScratchWorkspaceAsync(SYSTEM, async (workspace) => {
      await generateRuntime(
        workspace.root,
        workspace.path("node_modules/.theme/runtime.config.mjs"),
        workspace.path("generated"),
      );

      return workspace.read("generated/recipes/runtime.d.mts");
    });

    expect(declared).toContain('from "../types/recipe.d.mts";');
    expect(declared).toContain(
      "export declare function createRecipe<Variants extends RecipeVariantRecord>(",
    );
    expect(declared).toContain("): SlotRecipeRuntimeFn<Slot, RecipeSelection<Variants>, ");
  });

  it("leaves an unchanged runtime file as it was when generating again", async () => {
    const past = new Date("2020-01-01T00:00:00Z");
    const modified = await withScratchWorkspaceAsync(SYSTEM, async (workspace) => {
      const configPath = workspace.path("node_modules/.theme/runtime.config.mjs");
      const generated = workspace.path("generated");

      await generateRuntime(workspace.root, configPath, generated);
      utimesSync(workspace.path("generated/css/index.mjs"), past, past);
      await generateRuntime(workspace.root, configPath, generated);

      return statSync(workspace.path("generated/css/index.mjs")).mtime;
    });

    expect(modified).toStrictEqual(past);
  });

  it("leaves nothing under the cache directory but the configuration once generated", async () => {
    const left = await withScratchWorkspaceAsync(SYSTEM, async (workspace) => {
      await generateRuntime(
        workspace.root,
        workspace.path("node_modules/.theme/runtime.config.mjs"),
        workspace.path("generated"),
      );

      return workspace.files().filter((file) => file.startsWith("node_modules/.theme/"));
    });

    expect(left).toStrictEqual(["node_modules/.theme/runtime.config.mjs"]);
  });
});
