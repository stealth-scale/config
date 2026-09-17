import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { carry } from "#pack/carry.ts";

type Carrying = (
  built: Record<string, unknown>,
  context: { pkg: object },
) => Record<string, unknown>;

function carried(built: Record<string, unknown>, pkg: object): Record<string, unknown> {
  const held = (carry().config as UserConfig).pack as {
    exports: { customExports: Carrying };
  };

  return held.exports.customExports(built, { pkg });
}

describe("carry", () => {
  it("puts back a subpath naming a file the packer never built", () => {
    const held = carried(
      { ".": "./dist/index.mjs" },
      { exports: { "./globals": "./globals.d.ts" } },
    );

    expect(held["./globals"]).toBe("./globals.d.ts");
  });

  it("keeps everything the packer just built", () => {
    const held = carried(
      { ".": "./dist/index.mjs" },
      { exports: { "./globals": "./globals.d.ts" } },
    );

    expect(held["."]).toBe("./dist/index.mjs");
  });

  it("leaves a subpath the packer built alone", () => {
    const held = carried(
      { ".": "./dist/index.mjs" },
      { exports: { ".": { "stealth-source": "./src/index.ts" } } },
    );

    expect(held["."]).toBe("./dist/index.mjs");
  });

  it("leaves the manifest's own subpath alone", () => {
    const held = carried(
      { ".": "./dist/index.mjs" },
      { exports: { "./package.json": "./p.json" } },
    );

    expect(Object.keys(held)).toStrictEqual(["."]);
  });

  it("contributes nothing when the manifest declares no exports", () => {
    expect(carried({ ".": "./dist/index.mjs" }, {})).toStrictEqual({ ".": "./dist/index.mjs" });
  });

  it("contributes nothing when the exports field is not a map", () => {
    expect(carried({ ".": "./dist/index.mjs" }, { exports: "./src/index.ts" })).toStrictEqual({
      ".": "./dist/index.mjs",
    });
  });

  it("names the layer so a repository can remove it", () => {
    expect(carry().name).toBe("pack.carry");
  });
});
