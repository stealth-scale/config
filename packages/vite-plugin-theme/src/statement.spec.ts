import { describe, expect, it } from "vitest";

import {
  manifest,
  packageFiles,
  type ScratchFiles,
  type ScratchWorkspace,
  withScratchWorkspace,
  withScratchWorkspaceAsync,
} from "@stealthscale/testing";
import { type Importer, importer } from "@stealthscale/vite-plugin-base";

import { fontPackages, loadPreset, loadStatement, presetEntry } from "#statement.ts";

const APP: ScratchFiles = {
  "package.json": manifest({
    dependencies: { "@acme/kit": "*" },
    name: "@acme/app",
    type: "module",
  }),
  "theme.config.ts":
    'const fathom = { fonts: ["@f/face"], name: "fathom", variant: {} };\n\nexport default { themes: [fathom] };\n',
  ...packageFiles(
    "node_modules/@acme/kit",
    { exports: { ".": "./index.js", "./theme": "./theme.js" }, name: "@acme/kit", type: "module" },
    { "index.js": "export {};\n", "theme.js": 'export default { name: "@acme/kit" };\n' },
  ),
};

async function through<Result>(
  workspace: ScratchWorkspace,
  run: (through: Importer) => Promise<Result>,
): Promise<Result> {
  const opened = await importer({ root: workspace.root });

  try {
    return await run(opened);
  } finally {
    await opened.close();
  }
}

describe("statement", () => {
  it("loads the application's statement with the files behind it", async () => {
    const loaded = await withScratchWorkspaceAsync(APP, (workspace) =>
      through(workspace, async (opened) => {
        const { application, files } = await loadStatement(workspace.root, opened);

        return {
          first: files[0]?.slice(workspace.root.length + 1),
          name: application.themes?.[0]?.name,
        };
      }),
    );

    expect(loaded).toStrictEqual({ first: "theme.config.ts", name: "fathom" });
  });

  it("rejects a statement that exports no default", async () => {
    const files = { ...APP, "theme.config.ts": "export const other = 1;\n" };

    await expect(
      withScratchWorkspaceAsync(files, (workspace) =>
        through(workspace, (opened) => loadStatement(workspace.root, opened)),
      ),
    ).rejects.toThrow("theme.config.ts exports no default");
  });

  it("loads the preset a package publishes with the files behind it", async () => {
    const loaded = await withScratchWorkspaceAsync(APP, (workspace) =>
      through(workspace, async (opened) => {
        const { files, preset } = await loadPreset("@acme/kit", opened);

        return { first: files[0]?.slice(workspace.root.length + 1), name: preset.name };
      }),
    );

    expect(loaded).toStrictEqual({ first: "node_modules/@acme/kit/theme.js", name: "@acme/kit" });
  });

  it("rejects a preset that exports no default", async () => {
    const files = { ...APP, "node_modules/@acme/kit/theme.js": "export const other = 1;\n" };

    await expect(
      withScratchWorkspaceAsync(files, (workspace) =>
        through(workspace, (opened) => loadPreset("@acme/kit", opened)),
      ),
    ).rejects.toThrow("@acme/kit/theme exports no default");
  });

  it("finds the preset entry a manifest publishes as a string", () => {
    const entry = withScratchWorkspace(
      {
        "package.json": manifest({
          exports: { "./theme": "./src/theme.ts" },
          name: "@acme/design",
        }),
      },
      (workspace) => presetEntry(workspace.root)?.slice(workspace.root.length + 1),
    );

    expect(entry).toBe("src/theme.ts");
  });

  it("finds the preset entry under the first matching condition", () => {
    const entry = withScratchWorkspace(
      {
        "package.json": manifest({
          exports: { "./theme": { "acme-source": "./src/theme.ts", default: "./dist/theme.mjs" } },
          name: "@acme/design",
        }),
      },
      (workspace) => presetEntry(workspace.root, ["acme-source"])?.slice(workspace.root.length + 1),
    );

    expect(entry).toBe("src/theme.ts");
  });

  it("finds the preset entry under default when no condition matches", () => {
    const entry = withScratchWorkspace(
      {
        "package.json": manifest({
          exports: { "./theme": { "acme-source": "./src/theme.ts", default: "./dist/theme.mjs" } },
          name: "@acme/design",
        }),
      },
      (workspace) => presetEntry(workspace.root)?.slice(workspace.root.length + 1),
    );

    expect(entry).toBe("dist/theme.mjs");
  });

  it("returns undefined when the manifest publishes no preset", () => {
    const entry = withScratchWorkspace(
      { "package.json": manifest({ exports: { ".": "./index.js" }, name: "@acme/plain" }) },
      (workspace) => presetEntry(workspace.root),
    );

    expect(entry).toBeUndefined();
  });

  it("returns undefined when the entry names no target under any condition", () => {
    const entry = withScratchWorkspace(
      {
        "package.json": manifest({ exports: { "./theme": { types: "./theme.d.ts" } }, name: "x" }),
      },
      (workspace) => presetEntry(workspace.root),
    );

    expect(entry).toBeUndefined();
  });

  it("returns undefined when the manifest has no export map", () => {
    const entry = withScratchWorkspace({ "package.json": manifest({ name: "x" }) }, (workspace) =>
      presetEntry(workspace.root),
    );

    expect(entry).toBeUndefined();
  });

  it("returns undefined when there is no manifest", () => {
    expect(withScratchWorkspace({}, (workspace) => presetEntry(workspace.root))).toBeUndefined();
  });

  it("returns undefined when the entry is neither a string nor an object", () => {
    const entry = withScratchWorkspace(
      { "package.json": manifest({ exports: { "./theme": 3 }, name: "x" }) },
      (workspace) => presetEntry(workspace.root),
    );

    expect(entry).toBeUndefined();
  });

  it("collects the font packages of every theme once and sorted", () => {
    const application = {
      themes: [
        { fonts: ["@f/two", "@f/one"], name: "a", variant: {} },
        { fonts: ["@f/one"], name: "b", variant: {} },
        { name: "c", variant: {} },
      ] as const,
    };

    expect(fontPackages(application)).toStrictEqual(["@f/one", "@f/two"]);
  });

  it("collects no font package where the application states no theme", () => {
    expect(fontPackages({})).toStrictEqual([]);
  });
});
