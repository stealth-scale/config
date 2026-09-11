import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { carry } from "#pack/carry.ts";

/**
 * The packer's callback, as the layer states it.
 */
type Carrying = (
  built: Record<string, unknown>,
  context: { pkg: object },
) => Record<string, unknown>;

/**
 * Runs the layer's callback the way the packer would.
 *
 * @param built - The map the packer just wrote from what it built.
 * @param pkg - The manifest as it stands on disk.
 * @returns The map the packer writes instead.
 */
function carried(built: Record<string, unknown>, pkg: object): Record<string, unknown> {
  const held = (carry().config as UserConfig).pack as {
    exports: { customExports: Carrying };
  };

  return held.exports.customExports(built, { pkg });
}

test("puts back a subpath naming a file the packer never built", () => {
  const held = carried({ ".": "./dist/index.mjs" }, { exports: { "./globals": "./globals.d.ts" } });

  expect(held["./globals"]).toBe("./globals.d.ts");
});

test("keeps everything the packer just built", () => {
  const held = carried({ ".": "./dist/index.mjs" }, { exports: { "./globals": "./globals.d.ts" } });

  expect(held["."]).toBe("./dist/index.mjs");
});

test("leaves a subpath the packer built alone, its answer being the newer one", () => {
  const held = carried(
    { ".": "./dist/index.mjs" },
    { exports: { ".": { "stealth-source": "./src/index.ts" } } },
  );

  expect(held["."]).toBe("./dist/index.mjs");
});

test("leaves the manifest's own subpath alone, the packer writing that one itself", () => {
  const held = carried({ ".": "./dist/index.mjs" }, { exports: { "./package.json": "./p.json" } });

  expect(Object.keys(held)).toEqual(["."]);
});

test("carries nothing where the manifest declares no exports", () => {
  expect(carried({ ".": "./dist/index.mjs" }, {})).toEqual({ ".": "./dist/index.mjs" });
});

test("carries nothing where the exports field is not a map", () => {
  expect(carried({ ".": "./dist/index.mjs" }, { exports: "./src/index.ts" })).toEqual({
    ".": "./dist/index.mjs",
  });
});

test("names itself, so a package publishing only what it builds can take the layer back", () => {
  expect(carry().name).toBe("pack.carry");
});
