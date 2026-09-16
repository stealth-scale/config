/**
 * Proves a fixed development port survives composition and reaches a preview
 * server.
 */

import { resolveConfig, type ResolvedConfig, type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { defineConfig } from "@stealthscale/vite-config-core";

import { readBack } from "#preset/preset.fixtures.ts";
import { port } from "#server/port.ts";

/**
 * The directory a composed config is resolved against.
 */
const AT = import.meta.dirname;

/**
 * Resolves a config the way Vite does when it starts, so the preview defaults
 * appear.
 */
function running(config: UserConfig): Promise<ResolvedConfig> {
  return resolveConfig({ ...config, configFile: false }, "serve");
}

describe("port", () => {
  it("serves at the port it was given", () => {
    expect((port(3000).config as UserConfig).server?.port).toBe(3000);
  });

  it("fails on a busy port rather than moving to another", () => {
    expect((port(3000).config as UserConfig).server?.strictPort).toBe(true);
  });

  it("composes with the rest of a config rather than replacing the block", async () => {
    const held = await readBack(
      defineConfig(AT, { extends: [port(3000)], server: { host: true } }),
    );

    expect(held.server).toMatchObject({ host: true, port: 3000, strictPort: true });
  });

  it("lets a repository declare a port of its own", async () => {
    const held = await readBack(
      defineConfig(AT, { extends: [port(3000)], server: { port: 4000 } }),
    );

    expect(held.server?.port).toBe(4000);
  });

  it("leaves a preview server its own port", async () => {
    const held = await running(await readBack(defineConfig(AT, { extends: [port(3000)] })));

    expect(held.preview.port).not.toBe(3000);
  });

  it("gives a preview server the same fixed port", async () => {
    const held = await running(await readBack(defineConfig(AT, { extends: [port(3000)] })));

    expect(held.preview.strictPort).toBe(true);
  });
});
