import { type ConfigEnv, type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { defineConfig, layers } from "#preset/web.ts";

test("names every layer under this package, so provenance says where it came from", () => {
  for (const held of layers()) {
    expect(held.name.startsWith("react/")).toBe(true);
  }
});

test("lays out no page, a library having none to lay out", () => {
  expect(layers().some((one) => one.name.includes("layout.page"))).toBe(false);
});

test("compiles the JSX, so a component is specified under the transform it ships under", () => {
  expect(layers().map((one) => one.name)).toContain("react/react.refresh");
});

test("packs rather than builds, a library being published rather than deployed", async () => {
  const held = await (defineConfig({}) as (env: ConfigEnv) => Promise<UserConfig>)({
    command: "build",
    mode: "production",
  });

  expect(held.pack).toBeDefined();
  expect(held.build?.manifest).toBeUndefined();
});

test("binds the library tier and this package's layers into one defineConfig", async () => {
  const held = await (defineConfig({}) as (env: ConfigEnv) => Promise<UserConfig>)({
    command: "build",
    mode: "production",
  });

  expect(held.plugins).toBeDefined();
});
