import { describe, expect, it } from "vitest";

import { fontWeights } from "#preset/tokens/font-weights.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("fontWeights", () => {
  it("lists nine weights from thin to black", () => {
    expect(Object.keys(fontWeights)).toHaveLength(9);
    expect(tokenAt(fontWeights, "thin")).toBe("100");
    expect(tokenAt(fontWeights, "black")).toBe("900");
  });

  it("sets normal at four hundred", () => {
    expect(tokenAt(fontWeights, "normal")).toBe("400");
  });
});
