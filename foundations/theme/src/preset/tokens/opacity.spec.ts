import { describe, expect, it } from "vitest";

import { opacity } from "#preset/tokens/opacity.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("opacity", () => {
  it("names the three opacities a recipe reads", () => {
    expect(Object.keys(opacity).toSorted()).toStrictEqual(["backdrop", "disabled", "muted"]);
  });

  it("holds a disabled control at half", () => {
    expect(tokenAt(opacity, "disabled")).toBe("0.5");
  });
});
