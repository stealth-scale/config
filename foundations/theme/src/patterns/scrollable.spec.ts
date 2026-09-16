import { describe, expect, it } from "vitest";

import { scrollable } from "#patterns/scrollable.ts";

describe("scrollable", () => {
  it("scrolls vertically when nothing is stated", () => {
    expect(scrollable()).toStrictEqual({ overflowX: "hidden", overflowY: "auto" });
  });

  it("scrolls horizontally when asked", () => {
    expect(scrollable({ direction: "horizontal" })).toStrictEqual({
      overflowX: "auto",
      overflowY: "hidden",
    });
  });

  it("scrolls on both axes when asked", () => {
    expect(scrollable({ direction: "both" })).toStrictEqual({ overflow: "auto" });
  });

  it("hides the scrollbar in every engine when asked", () => {
    expect(scrollable({ hideScrollbar: true })).toMatchObject({
      "&::-webkit-scrollbar": { display: "none" },
      scrollbarWidth: "none",
    });
  });
});
