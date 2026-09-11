import { resolveConfig, type ResolvedConfig, type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { defineConfig } from "@stealthscale/vite-config-core";

import { readBack } from "#preset/preset.fixtures.ts";
import { proxy } from "#server/proxy.ts";

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

test("forwards the path it was given to the origin it was given", () => {
  const held = (proxy("/api", "http://localhost:8787").config as UserConfig).server?.proxy;

  expect(held).toEqual({ "/api": "http://localhost:8787" });
});

test("lets two modules each state a route, and keeps both", async () => {
  const held = await readBack(
    defineConfig(AT, { extends: [proxy("/api", "http://one"), proxy("/ws", "http://two")] }),
  );

  expect(held.server?.proxy).toEqual({ "/api": "http://one", "/ws": "http://two" });
});

test("lets a later route replace an earlier one naming the same path", async () => {
  const held = await readBack(
    defineConfig(AT, { extends: [proxy("/api", "http://one"), proxy("/api", "http://two")] }),
  );

  expect(held.server?.proxy).toEqual({ "/api": "http://two" });
});

test("names the path it forwards, so a removal can take that route back", () => {
  expect(proxy("/api", "http://one").name).toBe("server.proxy(/api)");
});

test("forwards in a preview server too, which reads its routes from these", async () => {
  const stated = await readBack(defineConfig(AT, { extends: [proxy("/api", "http://one")] }));
  const held = await running(stated);

  expect(held.preview.proxy).toEqual({ "/api": "http://one" });
});
