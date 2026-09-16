/**
 * Covers an import through Vite of a workspace package linked into a scratch workspace.
 *
 * @remarks
 *   The package publishes its source under one condition and a built copy under `default`, so
 *   which copy answers tells whether the conditions reached the resolver. The condition is written
 *   first in the export map, because a resolver takes the first condition that matches. The source
 *   imports a Node built-in, which the runner externalises, and the statement reaches the package
 *   twice, so the file list is measured on both.
 */

import { mkdirSync, symlinkSync } from "node:fs";
import { createServer, type ViteDevServer } from "vite";
import { describe, expect, it } from "vitest";

import { manifest, type ScratchWorkspace, withScratchWorkspaceAsync } from "@stealthscale/testing";

import { imported, importer } from "#load.ts";

/**
 * The condition the linked package publishes its source under.
 */
const SOURCE = "acme-source";

/**
 * The module the statement resolves to, read for the copy of the package it imported.
 */
interface Statement {
  default: { from: string };
}

/**
 * An application depending on a linked package that publishes source and a built copy.
 */
const TREE = {
  "package.json": manifest({ dependencies: { "@acme/kit": "workspace:*" }, name: "@acme/app" }),
  "packages/kit/dist/index.js": 'export const from = "dist";\n',
  "packages/kit/package.json": manifest({
    exports: { ".": { "acme-source": "./src/index.ts", default: "./dist/index.js" } },
    name: "@acme/kit",
    type: "module",
  }),
  "packages/kit/src/index.ts":
    'import { sep } from "node:path";\n\nexport const from: string = sep.length === 1 ? "source" : "";\n',
  "src/other.ts": 'import { from } from "@acme/kit";\n\nexport const other = from;\n',
  "src/statement.ts":
    'import { from } from "@acme/kit";\n\nimport { other } from "./other.ts";\n\nexport default { from, other };\n',
};

/**
 * Runs a function against the tree with the package linked into node_modules, the way a workspace
 * install links it, and returns what the function produced.
 */
function linked<Result>(run: (workspace: ScratchWorkspace) => Promise<Result>): Promise<Result> {
  return withScratchWorkspaceAsync(TREE, (workspace) => {
    mkdirSync(workspace.path("node_modules/@acme"), { recursive: true });
    symlinkSync(workspace.path("packages/kit"), workspace.path("node_modules/@acme/kit"), "dir");

    return run(workspace);
  });
}

describe("imported", () => {
  it("resolves a linked package to its source under the stated condition", async () => {
    const { module } = await linked((workspace) =>
      imported<Statement>(workspace.path("src/statement.ts"), {
        conditions: [SOURCE, "node"],
        root: workspace.root,
      }),
    );

    expect(module.default.from).toBe("source");
  });

  it("resolves a linked package to its default target when no condition is stated", async () => {
    const { module } = await linked((workspace) =>
      imported<Statement>(workspace.path("src/statement.ts"), { root: workspace.root }),
    );

    expect(module.default.from).toBe("dist");
  });

  it("lists each file behind the module once with its own first and no built-in", async () => {
    const files = await linked(async (workspace) => {
      const { files: read } = await imported<Statement>(workspace.path("src/statement.ts"), {
        conditions: [SOURCE, "node"],
        root: workspace.root,
      });

      return read.map((file) => file.slice(workspace.root.length + 1));
    });

    expect(files).toStrictEqual(["src/statement.ts", "packages/kit/src/index.ts", "src/other.ts"]);
  });

  it("imports a bare specifier from the root", async () => {
    const { module } = await linked((workspace) =>
      imported<{ from: string }>("@acme/kit", {
        conditions: [SOURCE, "node"],
        root: workspace.root,
      }),
    );

    expect(module.from).toBe("source");
  });

  it("imports a module Node provides and lists no file for it", async () => {
    const { files, module } = await linked((workspace) =>
      imported<{ sep: string }>("node:path", { root: workspace.root }),
    );

    expect(module.sep).toHaveLength(1);
    expect(files).toStrictEqual([]);
  });

  it("rejects when the specifier does not resolve", async () => {
    await expect(
      linked((workspace) => imported("@acme/absent", { root: workspace.root })),
    ).rejects.toThrow("@acme/absent");
  });

  it("imports through the dev server's runner when one is running", async () => {
    const seen = await linked(async (workspace) => {
      const file = workspace.path("src/statement.ts");
      const server = await createServer({
        configFile: false,
        envDir: false,
        environments: {
          ssr: { resolve: { conditions: [SOURCE, "node"], noExternal: true } },
        },
        logLevel: "silent",
        root: workspace.root,
        server: { middlewareMode: true, watch: null },
      });

      try {
        const { files, module } = await imported<Statement>(file, { root: workspace.root }, server);

        return {
          first: files[0] === file,
          from: module.default.from,
          graphed: server.environments["ssr"]?.moduleGraph.getModuleById(file) !== undefined,
        };
      } finally {
        await server.close();
      }
    });

    expect(seen).toStrictEqual({ first: true, from: "source", graphed: true });
  });

  it("builds its own environment when the server's ssr environment is not runnable", async () => {
    const server = { environments: { ssr: {} } } as unknown as ViteDevServer;
    const { module } = await linked((workspace) =>
      imported<Statement>(
        workspace.path("src/statement.ts"),
        { conditions: [SOURCE, "node"], root: workspace.root },
        server,
      ),
    );

    expect(module.default.from).toBe("source");
  });

  it("imports several modules through one importer until it is closed", async () => {
    const seen = await linked(async (workspace) => {
      const through = await importer({ conditions: [SOURCE, "node"], root: workspace.root });

      try {
        const statement = await through.import<Statement>(workspace.path("src/statement.ts"));
        const kit = await through.import<{ from: string }>("@acme/kit");

        return [statement.module.default.from, kit.module.from];
      } finally {
        await through.close();
      }
    });

    expect(seen).toStrictEqual(["source", "source"]);
  });

  it("leaves the dev server's environment running when its importer is closed", async () => {
    const seen = await linked(async (workspace) => {
      const file = workspace.path("src/statement.ts");
      const server = await createServer({
        configFile: false,
        envDir: false,
        environments: {
          ssr: { resolve: { conditions: [SOURCE, "node"], noExternal: true } },
        },
        logLevel: "silent",
        root: workspace.root,
        server: { middlewareMode: true, watch: null },
      });

      try {
        const through = await importer({ root: workspace.root }, server);

        await through.close();

        return (await imported<Statement>(file, { root: workspace.root }, server)).module.default
          .from;
      } finally {
        await server.close();
      }
    });

    expect(seen).toBe("source");
  });
});
