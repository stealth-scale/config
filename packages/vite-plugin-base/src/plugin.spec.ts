/**
 * Covers what a plugin receives when a bundler runs it.
 *
 * @remarks
 *   The hooks are called directly rather than through a build, because the
 *   thing under test is the wiring between them and a real build would supply
 *   it.
 */

import { describe, expect, it } from "vitest";

import { type Bundling, plugin } from "#plugin.ts";

/**
 * Stands in for the build a bundler binds while it generates a bundle.
 *
 * @remarks
 *   Only the three members these checks touch are present, and the cast hides
 *   the rest of the context. A check that reaches for a fourth member reads
 *   undefined instead of failing at the type.
 */
function building(): Bundling {
  return {
    emitFile: () => "",
    getModuleIds: () => [],
    getModuleInfo: () => null,
  } as unknown as Bundling;
}

/**
 * Drives a plugin through the hooks a bundler would call, in bundler order.
 *
 * @remarks
 *   Leaving the root out skips `configResolved` altogether, which is how a
 *   build that resolves no configuration reaches `generateBundle`.
 * @param held - The plugin under test.
 * @param root - The directory the bundler resolved, or nothing to skip the
 *   resolution hook.
 */
function running(held: ReturnType<typeof plugin>, root?: string): void {
  const hooks = held as unknown as {
    configResolved?: (config: { root: string }) => void;
    generateBundle?: (this: Bundling) => void;
  };

  if (root !== undefined) hooks.configResolved?.({ root });

  hooks.generateBundle?.call(building());
}

describe("plugin", () => {
  it("names the plugin as the bundler reports it", () => {
    expect(plugin({ name: "stealth:probe", writes: () => {} }).name).toBe("stealth:probe");
  });

  it("passes the build as an argument", () => {
    let held: unknown;

    running(plugin({ name: "probe", writes: (bundling) => void (held = bundling) }));

    expect(held).toBeDefined();
  });

  it("gives a plugin the directory the bundler resolved", () => {
    let held = "";

    running(
      plugin({ name: "probe", writes: (_bundling, at) => void (held = at) }),
      "/repository/packages/one",
    );

    expect(held).toBe("/repository/packages/one");
  });

  it("falls back to the working directory when the bundler resolves no config", () => {
    let held = "";

    running(plugin({ name: "probe", writes: (_bundling, at) => void (held = at) }));

    expect(held).toBe(process.cwd());
  });
});
