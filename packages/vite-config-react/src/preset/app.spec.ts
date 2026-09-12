import { type ConfigEnv, type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { defineConfig, layers } from "#preset/app.ts";

/**
 * Where the config under specification is: this package's own root.
 *
 * A config file sits at a package root, and the tier reads the manifest beside it. Naming this
 * directory instead would hand the layers a directory holding no manifest at all.
 */
const AT = new URL("../..", import.meta.url).pathname;

test("names every layer under this package, so a repository can take one back", () => {
  for (const held of layers()) {
    expect(held.name.startsWith("react/")).toBe(true);
  }
});

test("names no page, an application keeping its own where Vite looks for it", () => {
  expect(layers().some((one) => one.name.includes("page"))).toBe(false);
});

test("compiles the JSX and tears a rendered component down between tests", () => {
  const held = layers().map((one) => one.name);

  expect(held).toContain("react/react.refresh");
  expect(held).toContain("react/react.cleanup");
});

test("states no rules of its own, those being read from the root and nowhere else", () => {
  expect(
    layers()
      .map((one) => one.name)
      .join(),
  ).not.toContain("lint.");
});

test("binds the application tier and this package's layers into one defineConfig", async () => {
  const held = await (defineConfig(AT, {}) as (env: ConfigEnv) => Promise<UserConfig>)({
    command: "build",
    mode: "production",
  });

  expect(held.plugins).toBeDefined();
  expect(held.build?.rolldownOptions?.input).toBeUndefined();
});

test("builds rather than packs, an application being deployed rather than published", async () => {
  const held = await (defineConfig(AT, {}) as (env: ConfigEnv) => Promise<UserConfig>)({
    command: "build",
    mode: "production",
  });

  expect(held.build?.manifest).toBe(true);
  expect(held.pack).toBeUndefined();
});
