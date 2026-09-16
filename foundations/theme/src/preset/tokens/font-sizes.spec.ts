import { describe, expect, it } from "vitest";

import { fontSizes } from "#preset/tokens/font-sizes.ts";
import { fontSizes as scale } from "#scales/type.ts";

describe("fontSizes", () => {
  it("draws the type scale at its defaults", () => {
    expect(fontSizes).toStrictEqual(scale());
  });
});
