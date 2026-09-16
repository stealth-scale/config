import { describe, expect, it } from "vitest";

import { aspectRatios } from "#preset/tokens/aspect-ratios.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("aspectRatios", () => {
  it("lists seven ratios", () => {
    expect(Object.keys(aspectRatios)).toHaveLength(7);
  });

  it("writes each ratio as CSS reads one", () => {
    expect(tokenAt(aspectRatios, "square")).toBe("1 / 1");
    expect(tokenAt(aspectRatios, "golden")).toBe("1.618 / 1");
  });

  it("names the video ratio twice", () => {
    expect(tokenAt(aspectRatios, "video")).toBe(tokenAt(aspectRatios, "wide"));
  });
});
