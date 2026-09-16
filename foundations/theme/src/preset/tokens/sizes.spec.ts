import { describe, expect, it } from "vitest";

import { sizes } from "#preset/tokens/sizes.ts";
import { spacing } from "#preset/tokens/spacing.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("sizes", () => {
  it("carries every step of the spacing grid", () => {
    for (const step of Object.keys(spacing)) {
      expect(tokenAt(sizes, step)).toBe(tokenAt(spacing, step));
    }
  });

  it("names the widths from extra small to eight times extra large", () => {
    expect(tokenAt(sizes, "xs")).toBe("20rem");
    expect(tokenAt(sizes, "8xl")).toBe("90rem");
  });

  it("names the measure a column of text is read at and the intrinsic sizes", () => {
    expect(tokenAt(sizes, "prose")).toBe("60ch");
    expect(tokenAt(sizes, "min")).toBe("min-content");
    expect(tokenAt(sizes, "max")).toBe("max-content");
    expect(tokenAt(sizes, "fit")).toBe("fit-content");
    expect(tokenAt(sizes, "full")).toBe("100%");
  });
});
