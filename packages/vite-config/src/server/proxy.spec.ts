/**
 * Proves two proxy routes coexist, and that a later route naming a path wins.
 */

import { resolveConfig, type ResolvedConfig, type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { defineConfig } from "@stealthscale/vite-config-core";

import { readBack } from "#preset/preset.fixtures.ts";
import { proxy } from "#server/proxy.ts";

/**
 * The directory a composed config is resolved against.
 */
const AT = import.meta.dirname;

/**
 * Resolves a config the way Vite does when it starts, so the preview proxy
 * table appears.
 */
function running(config: UserConfig): Promise<ResolvedConfig> {
  return resolveConfig({ ...config, configFile: false }, "serve");
}

describe("proxy", () => {
  it("forwards the path it was given to the origin it was given", () => {
    const held = (proxy("/api", "http://localhost:8787").config as UserConfig).server?.proxy;

    expect(held).toStrictEqual({ "/api": "http://localhost:8787" });
  });

  it("lets two modules each add a route and keeps both", async () => {
    const held = await readBack(
      defineConfig(AT, { extends: [proxy("/api", "http://one"), proxy("/ws", "http://two")] }),
    );

    expect(held.server?.proxy).toStrictEqual({ "/api": "http://one", "/ws": "http://two" });
  });

  it("lets a later route replace an earlier one naming the same path", async () => {
    const held = await readBack(
      defineConfig(AT, { extends: [proxy("/api", "http://one"), proxy("/api", "http://two")] }),
    );

    expect(held.server?.proxy).toStrictEqual({ "/api": "http://two" });
  });

  it("names the path it forwards", () => {
    expect(proxy("/api", "http://one").name).toBe("server.proxy(/api)");
  });

  it("forwards in a preview server too", async () => {
    const stated = await readBack(defineConfig(AT, { extends: [proxy("/api", "http://one")] }));
    const held = await running(stated);

    expect(held.preview.proxy).toStrictEqual({ "/api": "http://one" });
  });
});
