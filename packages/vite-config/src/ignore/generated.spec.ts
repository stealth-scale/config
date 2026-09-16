import { describe, expect, it } from "vitest";

import { GENERATED } from "#ignore/generated.ts";

describe("generated", () => {
  it("ignores what a tool wrote under either conventional spelling", () => {
    expect(GENERATED).toStrictEqual(["**/*.gen.*", "**/generated/**"]);
  });

  it("names neither node_modules nor a build directory", () => {
    for (const held of GENERATED) {
      expect(held).not.toContain("node_modules");
      expect(held).not.toContain("dist");
    }
  });
});
