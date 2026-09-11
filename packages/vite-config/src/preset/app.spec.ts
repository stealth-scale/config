import { type ConfigEnv, type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { type Layer } from "@stealthscale/vite-config-core";

import { defineConfig, layers } from "#preset/app.ts";
import { layers as web } from "#preset/web.ts";

/**
 * Where the config under specification is: this package's own root.
 *
 * A config file sits at a package root, and the tier reads the manifest beside it. Naming this
 * directory instead would hand the layers a directory holding no manifest at all.
 */
const AT = new URL("../..", import.meta.url).pathname;

/**
 * Names every layer the tier is built on.
 *
 * @param of - The tier's layers.
 * @returns Every name in it.
 */
function names(of: ReturnType<typeof layers>): string[] {
  const flat: Layer[] = of.flatMap((held) =>
    Array.isArray(held) ? (held as Layer[]) : [held as Layer],
  );

  return flat.map((held) => held.name);
}

test("packs nothing, an application having no export map for a packer to write", () => {
  expect(names(layers()).join()).not.toContain("pack.");
});

test("builds, which is the half of the pair a library does not do", () => {
  const held = names(layers());

  expect(held).toContain("build.manifest");
  expect(held).toContain("build.sourcemaps");
  expect(held).toContain("build.preload");
});

test("bundles a worker as a module, so one added later can import at all", () => {
  expect(names(layers())).toContain("worker.format");
});

test("is the browser's rules and the browser's environment", () => {
  const held = names(layers());

  expect(held).toContain("test.environment(happy-dom)");
  expect(held.some((one) => one.startsWith("lint."))).toBe(true);
});

test("is the same as the library tier but for what is deployed rather than published", () => {
  const held = new Set(names(layers()));
  const other = new Set(names(web()));
  const onlyHere = [...held].filter((one) => !other.has(one));
  const onlyThere = [...other].filter((one) => !held.has(one));

  expect(onlyHere.every((one) => one.startsWith("build.") || one === "worker.format")).toBe(true);
  expect(onlyThere.every((one) => one.startsWith("pack."))).toBe(true);
});

test("composes into a config a repository's own keys still win over", async () => {
  const held = await (
    defineConfig(AT, { build: { manifest: false } }) as (env: ConfigEnv) => Promise<UserConfig>
  )({ command: "build", mode: "production" });

  expect(held.build?.manifest).toBe(false);
});
