import { describe, expect, it } from "vitest";

import { easings } from "#preset/tokens/easings.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("easings", () => {
  it("names the compiler's three curves and the two added", () => {
    expect(Object.keys(easings).toSorted()).toStrictEqual([
      "in",
      "in-out",
      "in-smooth",
      "linear",
      "out",
    ]);
  });

  it("writes each curve as CSS reads one", () => {
    expect(tokenAt(easings, "out")).toBe("cubic-bezier(0, 0, 0.2, 1)");
    expect(tokenAt(easings, "linear")).toBe("linear");
  });
});
