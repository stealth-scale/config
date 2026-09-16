import { describe, expect, it } from "vitest";

import { blurs } from "#preset/tokens/blurs.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("blurs", () => {
  it("adds none and a single pixel below the compiler's scale", () => {
    expect(tokenAt(blurs, "none")).toBe("0");
    expect(tokenAt(blurs, "2xs")).toBe("1px");
    expect(tokenAt(blurs, "xs")).toBe("4px");
  });

  it("runs to a whole panel", () => {
    expect(tokenAt(blurs, "3xl")).toBe("64px");
  });
});
