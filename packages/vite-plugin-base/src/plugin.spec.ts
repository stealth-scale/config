import { describe, expect, it } from "vitest";

import { type Bundling, plugin } from "#plugin.ts";

/**
 * Stands in for the build a hook is handed.
 *
 * @returns Something with the shape a hook reads, holding nothing.
 */
function building(): Bundling {
  return {
    emitFile: () => "",
    getModuleIds: () => [],
    getModuleInfo: () => null,
  } as unknown as Bundling;
}

/**
 * Calls a plugin's hooks the way a bundler does, with the build as `this`.
 *
 * @param held - The plugin.
 * @param root - What the resolved config says the directory is, or nothing to skip that hook.
 * @returns Nothing; what the plugin did is what a test reads.
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
