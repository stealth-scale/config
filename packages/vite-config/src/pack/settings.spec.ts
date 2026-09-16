import { describe, expect, it } from "vitest";

import { type Commands, type Moments, type Packing } from "#pack/settings.ts";

function ran(): void {
  return undefined;
}

describe("settings", () => {
  it("narrows the packer to one configuration", () => {
    const held: Packing = { dts: true, entry: { index: "src/index.ts" } };

    expect(held.dts).toBe(true);
  });

  it("throws for a moment the packer does not run", () => {
    // @ts-expect-error -- the packer runs `build:prepare`, `build:before` and `build:done`.
    const held: Moments = { "build:whenever": ran };

    expect(Object.keys(held)).toHaveLength(1);
  });

  it("takes the hooks as a map rather than as a registrar", () => {
    const held: Moments = { "build:done": ran };

    expect(held["build:done"]).toBeTypeOf("function");
  });

  it("names a command against the file behind it", () => {
    const held: Commands = { stealth: "src/bin/stealth.ts" };

    expect(held["stealth"]).toBe("src/bin/stealth.ts");
  });
});
