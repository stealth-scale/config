import { describe, expect, it } from "vitest";

import { type Runs, type Staging } from "#staged/settings.ts";

describe("settings", () => {
  it("takes a rule written as nothing but its command", () => {
    const held: Runs = "vp check --fix";

    expect(held).toBe("vp check --fix");
  });

  it("takes several commands", () => {
    const held: Runs = ["vp fmt", "vp check"];

    expect(held).toHaveLength(2);
  });

  it("maps each glob to the command run on the staged files matching it", () => {
    const held: Staging = { "*.ts": "vp check --fix" };

    expect(Object.keys(held)).toStrictEqual(["*.ts"]);
  });
});
