import { resolveConfig, type ResolvedConfig, type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { defineConfig } from "@stealthscale/config-core";

import { readBack } from "#preset/preset.fixtures.ts";
import { port } from "#server/port.ts";

/**
 * Where the config under specification is, which every `defineConfig` states for itself.
 */
const AT = import.meta.dirname;

/**
 * Resolves a config the way a running server does, which is where a default settles.
 *
 * @param config - What a repository stated.
 * @returns The config with every default filled in.
 */
function running(config: UserConfig): Promise<ResolvedConfig> {
  return resolveConfig({ ...config, configFile: false }, "serve");
}

test("serves at the port it was given", () => {
  expect((port(3000).config as UserConfig).server?.port).toBe(3000);
});

test("pins it, so a busy port fails rather than quietly becoming another one", () => {
  expect((port(3000).config as UserConfig).server?.strictPort).toBe(true);
});

test("composes with the rest of a config rather than replacing the block", async () => {
  const held = await readBack(defineConfig(AT, { extends: [port(3000)], server: { host: true } }));

  expect(held.server).toMatchObject({ host: true, port: 3000, strictPort: true });
});

test("lets a repository state a port of its own, which wins over the layer", async () => {
  const held = await readBack(defineConfig(AT, { extends: [port(3000)], server: { port: 4000 } }));

  expect(held.server?.port).toBe(4000);
});

test("leaves a preview server its own port, so an app can be previewed while it is served", async () => {
  const held = await running(await readBack(defineConfig(AT, { extends: [port(3000)] })));

  expect(held.preview.port).not.toBe(3000);
});

test("hands a preview server the same refusal to move", async () => {
  const held = await running(await readBack(defineConfig(AT, { extends: [port(3000)] })));

  expect(held.preview.strictPort).toBe(true);
});
