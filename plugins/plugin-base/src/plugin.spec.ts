import { expect, test } from "vite-plus/test";

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

test("is named what the bundler will report it as", () => {
  expect(plugin({ name: "stealth:probe", writes: () => {} }).name).toBe("stealth:probe");
});

test("hands the build over as an argument, so nothing downstream writes `this`", () => {
  let held: unknown;

  running(plugin({ name: "probe", writes: (bundling) => void (held = bundling) }));

  expect(held).toBeDefined();
});

test("tells a plugin the directory the bundler settled on", () => {
  let held = "";

  running(
    plugin({ name: "probe", writes: (_bundling, at) => void (held = at) }),
    "/repository/packages/one",
  );

  expect(held).toBe("/repository/packages/one");
});

test("falls back to where the command runs, for a bundler that resolves no config", () => {
  let held = "";

  running(plugin({ name: "probe", writes: (_bundling, at) => void (held = at) }));

  expect(held).toBe(process.cwd());
});
