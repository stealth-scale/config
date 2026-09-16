import { statSync, utimesSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  configured,
  hookContext,
  manifest,
  type ScratchFiles,
  started,
  updated,
  withScratchWorkspaceAsync,
} from "@stealthscale/testing";

import { runtime } from "#theme/runtime.ts";

function preset(tokens = ""): string {
  return [
    "export default {",
    '  name: "@acme/design",',
    `  theme: { extend: { tokens: { colors: { ${tokens} } } } },`,
    "};",
    "",
  ].join("\n");
}

const SYSTEM: ScratchFiles = {
  "package.json": manifest({
    exports: { ".": "./src/index.ts", "./theme": "./src/theme.ts" },
    name: "@acme/design",
    type: "module",
  }),
  "src/index.ts": "export {};\n",
  "src/theme.ts": preset(),
};

const RESOLVED = { ssr: {} };

describe("runtime", () => {
  it("names the plugin for its factory", () => {
    expect(runtime().name).toBe("stealth:theme.runtime");
  });

  it("generates the runtime as soon as the root is known", async () => {
    const files = await withScratchWorkspaceAsync(SYSTEM, async (workspace) => {
      await configured(runtime(), { ...RESOLVED, root: workspace.root });

      return workspace.files();
    });

    expect(files).toContain("generated/css/index.mjs");
    expect(files).toContain("generated/jsx/index.mjs");
    expect(files).toContain("generated/recipes/runtime.mjs");
    expect(files).toContain("generated/recipes/runtime.d.mts");
    expect(files).toContain("node_modules/.theme/runtime.config.mjs");
  });

  it("writes every relative import with its extension", async () => {
    const written = await withScratchWorkspaceAsync(SYSTEM, async (workspace) => {
      await configured(runtime(), { ...RESOLVED, root: workspace.root });

      return workspace.read("generated/css/index.mjs");
    });

    expect(written).toContain("./css.mjs");
    expect(written).not.toContain('"./css"');
  });

  it("reads the preset under the conditions the package resolves with", async () => {
    const files = {
      ...SYSTEM,
      "package.json": manifest({
        exports: { "./theme": { "acme-source": "./src/theme.ts", default: "./dist/theme.mjs" } },
        name: "@acme/design",
        type: "module",
      }),
      "src/theme.ts": preset('brand: { value: "#abc" }'),
    };
    const written = await withScratchWorkspaceAsync(files, async (workspace) => {
      await configured(runtime(), {
        root: workspace.root,
        ssr: { resolve: { conditions: ["acme-source"] } },
      });

      return workspace.read("generated/tokens/index.mjs");
    });

    expect(written).toContain("brand");
  });

  it("throws when the package publishes no preset", async () => {
    const files = { ...SYSTEM, "package.json": manifest({ name: "@acme/design" }) };

    await expect(
      withScratchWorkspaceAsync(files, (workspace) =>
        configured(runtime(), { ...RESOLVED, root: workspace.root }),
      ),
    ).rejects.toThrow("publishes no preset under ./theme");
  });

  it("throws when the preset exports no default", async () => {
    const files = { ...SYSTEM, "src/theme.ts": "export const other = 1;\n" };

    await expect(
      withScratchWorkspaceAsync(files, (workspace) =>
        configured(runtime(), { ...RESOLVED, root: workspace.root }),
      ),
    ).rejects.toThrow("src/theme.ts exports no default");
  });

  it("watches the file the preset was loaded from", async () => {
    const watched = await withScratchWorkspaceAsync(SYSTEM, async (workspace) => {
      const plugin = runtime();
      const context = hookContext();

      await configured(plugin, { ...RESOLVED, root: workspace.root });
      await started(plugin, context);

      return context.watched.map((file) => file.slice(workspace.root.length + 1));
    });

    expect(watched).toContain("src/theme.ts");
  });

  it("regenerates when the preset changes", async () => {
    const written = await withScratchWorkspaceAsync(SYSTEM, async (workspace) => {
      const plugin = runtime();

      await configured(plugin, { ...RESOLVED, root: workspace.root });
      workspace.write({ "src/theme.ts": preset('brand: { value: "#abc" }') });
      await updated(plugin, hookContext(), workspace.path("src/theme.ts"));

      return workspace.read("generated/tokens/index.mjs");
    });

    expect(written).toContain("brand");
  });

  it("leaves the runtime alone when a file behind no token changes", async () => {
    const same = await withScratchWorkspaceAsync(SYSTEM, async (workspace) => {
      const plugin = runtime();

      await configured(plugin, { ...RESOLVED, root: workspace.root });

      const before = workspace.read("generated/css/index.mjs");

      workspace.write({ "src/theme.ts": preset('brand: { value: "#abc" }') });
      await updated(plugin, hookContext(), workspace.path("src/index.ts"));

      return workspace.read("generated/css/index.mjs") === before;
    });

    expect(same).toBe(true);
  });

  it("leaves a generated file the change did not reach as it was when regenerating", async () => {
    const past = new Date("2020-01-01T00:00:00Z");
    const modified = await withScratchWorkspaceAsync(SYSTEM, async (workspace) => {
      const plugin = runtime();

      await configured(plugin, { ...RESOLVED, root: workspace.root });
      utimesSync(workspace.path("generated/css/index.mjs"), past, past);
      workspace.write({ "src/theme.ts": preset('brand: { value: "#abc" }') });
      await updated(plugin, hookContext(), workspace.path("src/theme.ts"));

      return {
        tokens: workspace.read("generated/tokens/index.mjs").includes("brand"),
        untouched: statSync(workspace.path("generated/css/index.mjs")).mtime,
      };
    });

    expect(modified).toStrictEqual({ tokens: true, untouched: past });
  });
});
