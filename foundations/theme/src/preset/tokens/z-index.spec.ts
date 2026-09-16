import { describe, expect, it } from "vitest";

import { zIndex } from "#preset/tokens/z-index.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("zIndex", () => {
  it("lists thirteen rungs", () => {
    expect(Object.keys(zIndex)).toHaveLength(13);
  });

  it("puts a dialog above the overlay and a tooltip above the dialog", () => {
    expect(Number(tokenAt(zIndex, "modal"))).toBeGreaterThan(Number(tokenAt(zIndex, "overlay")));
    expect(Number(tokenAt(zIndex, "tooltip"))).toBeGreaterThan(Number(tokenAt(zIndex, "modal")));
  });

  it("hides below the page and tops out at the largest integer", () => {
    expect(tokenAt(zIndex, "hide")).toBe(-1);
    expect(tokenAt(zIndex, "max")).toBe(2_147_483_647);
  });
});
