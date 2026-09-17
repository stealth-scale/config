import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { declarations } from "#pack/declarations.ts";

describe("declarations", () => {
  it("asks for types rather than leaving the packer to work out whether to emit them", () => {
    const held = (declarations().config as UserConfig).pack as { dts: boolean };

    expect(held.dts).toBe(true);
  });

  it("names the layer so a repository can remove it", () => {
    expect(declarations().name).toBe("pack.declarations");
  });
});
