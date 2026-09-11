import { type ConfigEnv, type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { flattened } from "#core/compose.ts";
import { defineConfig, layers } from "#preset/app.ts";
import { layers as web } from "#preset/web.ts";

/**
 * Names every layer the tier is built on.
 *
 * @param of - The tier's layers.
 * @returns Every name in it.
 */
function names(of: ReturnType<typeof layers>): string[] {
  return flattened(of).map((held) => held.name);
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

test("is the browser's rules and the browser's environment", () => {
  const held = names(layers());

  expect(held).toContain("test.environment(happy-dom)");
  expect(held.some((one) => one.startsWith("lint."))).toBe(true);
});

test("is the same as the library tier but for which of the two blocks it carries", () => {
  const held = new Set(names(layers()));
  const other = new Set(names(web()));
  const onlyHere = [...held].filter((one) => !other.has(one));
  const onlyThere = [...other].filter((one) => !held.has(one));

  expect(onlyHere.every((one) => one.startsWith("build."))).toBe(true);
  expect(onlyThere.every((one) => one.startsWith("pack."))).toBe(true);
});

test("composes into a config a repository's own keys still win over", async () => {
  const held = await (
    defineConfig({ build: { manifest: false } }) as (env: ConfigEnv) => Promise<UserConfig>
  )({ command: "build", mode: "production" });

  expect(held.build?.manifest).toBe(false);
});
