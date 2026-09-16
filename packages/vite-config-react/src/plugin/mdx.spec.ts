/**
 * Checks where the MDX plugin lands, what it compiles, and that the published declarations agree.
 */

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { type Contribution, type Override } from "@stealthscale/vite-config";

import { mdx, options } from "#plugin/mdx.ts";
import { FACTORY } from "#plugin/refresh.ts";

type Refining = Parameters<Override["refine"]>[0];

const HERE = new URL("../../", import.meta.url).pathname;

const CONTEXT: Refining = {
  at: HERE,
  command: "build",
  env: {},
  manifest: {},
  mode: "production",
  root: HERE,
};

interface Named {
  enforce?: string;
  name: string;
}

/**
 * Reads the plugin name and phase off whatever the layer put into a plugin list.
 */
function named(value: unknown): Named {
  if (typeof value !== "object" || value === null || !("name" in value)) {
    throw new Error("the plugin list holds something without a name");
  }

  return value as Named;
}

/**
 * Takes the override out of the pair the layer returns.
 */
function compiled(): Override {
  const [held] = mdx();

  if (held?.kind !== "override") throw new Error("the first MDX layer is not an override");

  return held;
}

/**
 * Takes the packer's contribution out of the pair the layer returns.
 */
function packed(): Contribution {
  const [, held] = mdx();

  if (held?.kind !== "contribution") throw new Error("the second MDX layer is not a contribution");

  return held;
}

describe("mdx", () => {
  it("names both layers for the call a consumer wrote", () => {
    expect(mdx().map((one) => one.name)).toStrictEqual([
      "react.plugin.mdx",
      "react.plugin.mdx(pack)",
    ]);
  });

  it("puts the plugin ahead of whatever plugins the tree built and in the pre phase", () => {
    const refined = compiled().refine(CONTEXT, { plugins: [{ name: "other" }] });
    const [first, second] = (refined.plugins ?? []).map((one) => named(one));

    expect(first).toStrictEqual(
      expect.objectContaining({ enforce: "pre", name: "@mdx-js/rollup" }),
    );
    expect(second?.name).toBe("other");
  });

  it("puts the plugin first when the tree built none", () => {
    expect(compiled().refine(CONTEXT, {}).plugins).toHaveLength(1);
  });

  it("appends to the packer's plugins rather than replacing them", () => {
    expect(packed().at).toBe("pack.plugins");
    expect(named(packed().item).name).toBe("@mdx-js/rollup");
  });

  it("compiles .mdx and leaves markdown alone", () => {
    expect(options({}).format).toBe("mdx");
  });

  it("imports the factory from React unless the repository renders through something else", () => {
    expect(options({}).jsxImportSource).toBe(FACTORY);
    expect(options({ from: "@emotion/react" }).jsxImportSource).toBe("@emotion/react");
  });

  it("publishes the declaration file a consumer references", () => {
    const held = JSON.parse(readFileSync(`${HERE}package.json`, "utf8")) as {
      exports: Record<string, string>;
      files: string[];
    };
    const declared = readFileSync(`${HERE}mdx.d.ts`, "utf8");

    expect(held.files).toContain("mdx.d.ts");
    expect(held.exports["./mdx"]).toBe("./mdx.d.ts");
    expect(declared).toContain('/// <reference types="mdx" />');
    expect(declared).toContain('declare module "mdx/types.js"');
  });
});
