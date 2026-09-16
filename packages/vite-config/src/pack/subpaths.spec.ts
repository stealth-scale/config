import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { type Packed } from "#pack/carry.ts";
import { subpaths } from "#pack/subpaths.ts";

function published(
  exports: Record<string, string>,
  built: Record<string, unknown>,
  pkg: object,
): Record<string, unknown> {
  const held = (subpaths(exports).config as UserConfig).pack as {
    exports: {
      customExports: (of: Record<string, unknown>, at: Packed) => Record<string, unknown>;
    };
  };

  return held.exports.customExports(built, { pkg });
}

describe("subpaths", () => {
  it("publishes a subpath no manifest names and no bundler built", () => {
    const held = published({ "./theme.css": "./dist/theme.css" }, { ".": "./dist/index.mjs" }, {});

    expect(held["./theme.css"]).toBe("./dist/theme.css");
  });

  it("keeps what the packer just built", () => {
    const held = published({ "./theme.css": "./dist/theme.css" }, { ".": "./dist/index.mjs" }, {});

    expect(held["."]).toBe("./dist/index.mjs");
  });

  it("keeps what the manifest names", () => {
    const held = published(
      { "./theme.css": "./dist/theme.css" },
      {},
      { exports: { "./g": "./g.d.ts" } },
    );

    expect(held["./g"]).toBe("./g.d.ts");
    expect(held["./theme.css"]).toBe("./dist/theme.css");
  });

  it("wins over the manifest for a subpath both name", () => {
    const held = published({ "./g": "./dist/g.css" }, {}, { exports: { "./g": "./g.d.ts" } });

    expect(held["./g"]).toBe("./dist/g.css");
  });

  it("names the subpaths", () => {
    expect(subpaths({ "./a": "./a.css", "./b": "./b.css" }).name).toBe("pack.subpaths(./a, ./b)");
  });
});
