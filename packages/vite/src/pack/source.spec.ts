import { readFileSync } from "node:fs";
import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { source } from "#pack/source.ts";
import { SOURCE } from "#resolve/condition.ts";

/**
 * The published packages whose export maps name the source condition.
 */
const PUBLISHED = ["vite", "react", "stylelint"];

/**
 * Reads a package's manifest.
 *
 * @param name - The package directory under `packages`.
 * @returns Its parsed contents.
 */
function manifest(name: string): {
  files: string[];
  publishConfig: { exports: Record<string, string> };
} {
  const at = new URL(`../../../${name}/package.json`, import.meta.url).pathname;

  return JSON.parse(readFileSync(at, "utf8")) as {
    files: string[];
    publishConfig: { exports: Record<string, string> };
  };
}

test("tells the packer which condition resolves a package to its source", () => {
  const held = (source().config as UserConfig).pack as { exports: { devExports: string } };

  expect(held.exports.devExports).toBe(SOURCE);
});

/**
 * What a package manager ships whether or not the manifest names it.
 */
const ALWAYS = ["package.json"];

test("ships whatever the published map points at, in every published package", () => {
  for (const name of PUBLISHED) {
    const held = manifest(name);

    for (const [subpath, path] of Object.entries(held.publishConfig.exports)) {
      const named = path.replace("./", "");
      const top = named.split("/")[0] ?? "";
      const shipped = [...held.files, ...ALWAYS].some((file) => file === top || file === named);

      expect(shipped, `${name} publishes ${subpath} from ${named}, which it does not ship`).toBe(
        true,
      );
    }
  }
});

test("names the source condition in what a workspace reads and not in what is published", () => {
  for (const name of PUBLISHED) {
    const held = manifest(name);

    for (const path of Object.values(held.publishConfig.exports)) {
      expect(path, `${name} publishes a path into its own source`).not.toContain("src/");
    }
  }
});
