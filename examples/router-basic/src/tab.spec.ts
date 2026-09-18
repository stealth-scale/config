import { describe, expect, it } from "vitest";

import { tabOf } from "#tab.ts";

describe("tabOf", () => {
  it("reads the tab the search string names", () => {
    expect(tabOf({ tab: "history" })).toStrictEqual({ tab: "history" });
  });

  it("falls back to the lines where the search names no tab", () => {
    expect(tabOf({})).toStrictEqual({ tab: "lines" });
  });

  it("falls back to the lines where the search names a tab this page has none of", () => {
    expect(tabOf({ tab: "attachments" })).toStrictEqual({ tab: "lines" });
  });
});
