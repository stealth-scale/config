import { type ConfigEnv, type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { defineConfig as application } from "@stealthscale/vite-config/preset/app";
import { defineConfig as library } from "@stealthscale/vite-config/preset/web";

import { layers } from "#layers.ts";

/**
 * Where the config under specification is: this package's own root.
 *
 * A config file sits at a package root, and the tier reads the manifest beside it. Naming this
 * directory instead would hand the layers a directory holding no manifest at all.
 */
const AT = new URL("..", import.meta.url).pathname;

/**
 * The environment a build is read in.
 */
const BUILDING: ConfigEnv = { command: "build", mode: "production" };

describe("layers", () => {
  it("names every layer for the call a consumer wrote under this package's own name", () => {
    expect(layers().map((one) => one.name)).toStrictEqual([
      "react.plugin.refresh",
      "react.test.cleanup",
      "react.test.document",
    ]);
  });

  it("declares no rules of its own", () => {
    expect(
      layers()
        .map((one) => one.name)
        .join(),
    ).not.toContain("lint");
  });

  it("composes beside the application tier", async () => {
    const defined = application(AT, { extends: [layers()] }) as (
      env: ConfigEnv,
    ) => Promise<UserConfig>;
    const held = await defined(BUILDING);

    expect(held.plugins).toBeDefined();
    expect(held.build?.manifest).toBe(true);
    expect(held.pack).toBeUndefined();
  });

  it("composes beside the library tier", async () => {
    const defined = library(AT, { extends: [layers()] }) as (env: ConfigEnv) => Promise<UserConfig>;
    const held = await defined(BUILDING);

    expect(held.plugins).toBeDefined();
    expect(held.pack).toBeDefined();
    expect(held.build?.manifest).toBeUndefined();
  });

  it("gives the tests a document beside either tier", async () => {
    const defined = library(AT, { extends: [layers()] }) as (env: ConfigEnv) => Promise<UserConfig>;

    expect((await defined(BUILDING)).test?.environment).toBe("happy-dom");
  });
});
