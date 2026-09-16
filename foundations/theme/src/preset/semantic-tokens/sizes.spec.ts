import { describe, expect, it } from "vitest";

import { sizes } from "#preset/semantic-tokens/sizes.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("sizes", () => {
  it("draws a medium control at two and a half rem", () => {
    expect(tokenAt(sizes, "control.md")).toBe("2.5000rem");
  });

  it("draws a medium icon at one and a quarter rem", () => {
    expect(tokenAt(sizes, "icon.md")).toBe("1.2500rem");
  });
});
