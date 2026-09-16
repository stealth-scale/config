import { describe, expect, it } from "vitest";

import { slug } from "#slug.ts";

describe("slug", () => {
  it("lowers the case", () => {
    expect(slug("Release Notes")).toBe("release-notes");
  });

  it("collapses a run of anything else into one separator", () => {
    expect(slug("one  --  two")).toBe("one-two");
  });

  it("leaves no separator at either end", () => {
    expect(slug("  edges  ")).toBe("edges");
  });

  it("answers nothing for a title holding nothing to keep", () => {
    expect(slug("!!!")).toBe("");
  });
});
