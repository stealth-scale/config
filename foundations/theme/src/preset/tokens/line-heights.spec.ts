import { describe, expect, it } from "vitest";

import { lineHeights } from "#preset/tokens/line-heights.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("lineHeights", () => {
  it("lists six unitless leadings", () => {
    expect(Object.keys(lineHeights)).toHaveLength(6);
    expect(
      Object.keys(lineHeights).every((name) =>
        /^[\d.]+$/u.test(String(tokenAt(lineHeights, name))),
      ),
    ).toBe(true);
  });

  it("runs from none at one to loose at two", () => {
    expect(tokenAt(lineHeights, "none")).toBe("1");
    expect(tokenAt(lineHeights, "normal")).toBe("1.5");
    expect(tokenAt(lineHeights, "loose")).toBe("2");
  });
});
