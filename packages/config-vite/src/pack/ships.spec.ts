import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { type Packed } from "#pack/carry.ts";
import { ships } from "#pack/ships.ts";

/**
 * Runs the layer's callback the way the packer would.
 *
 * @param exports - The subpaths the repository worked out.
 * @param built - The map the packer wrote from what it built.
 * @param pkg - The manifest as it stands on disk.
 * @returns The map the packer writes instead.
 */
function shipped(
  exports: Record<string, string>,
  built: Record<string, unknown>,
  pkg: object,
): Record<string, unknown> {
  const held = (ships(exports).config as UserConfig).pack as {
    exports: {
      customExports: (of: Record<string, unknown>, at: Packed) => Record<string, unknown>;
    };
  };

  return held.exports.customExports(built, { pkg });
}

test("publishes a subpath no manifest names and no bundler built", () => {
  const held = shipped({ "./theme.css": "./dist/theme.css" }, { ".": "./dist/index.mjs" }, {});

  expect(held["./theme.css"]).toBe("./dist/theme.css");
});

test("keeps what the packer just built", () => {
  const held = shipped({ "./theme.css": "./dist/theme.css" }, { ".": "./dist/index.mjs" }, {});

  expect(held["."]).toBe("./dist/index.mjs");
});

test("keeps what the manifest names, so a package need not write its own list twice", () => {
  const held = shipped(
    { "./theme.css": "./dist/theme.css" },
    {},
    { exports: { "./g": "./g.d.ts" } },
  );

  expect(held["./g"]).toBe("./g.d.ts");
  expect(held["./theme.css"]).toBe("./dist/theme.css");
});

test("wins over the manifest for a subpath both name, the computed one being the newer", () => {
  const held = shipped({ "./g": "./dist/g.css" }, {}, { exports: { "./g": "./g.d.ts" } });

  expect(held["./g"]).toBe("./dist/g.css");
});

test("names the subpaths, so a config says what was published beyond the manifest", () => {
  expect(ships({ "./a": "./a.css", "./b": "./b.css" }).name).toBe("pack.ships(./a, ./b)");
});
