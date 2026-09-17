import { describe, expect, it } from "vitest";

import { tokens } from "#tokens.ts";

describe("tokens", () => {
  it("draws eleven steps of violet at the product hue", () => {
    const purple = tokens.colors?.["purple"];

    expect(Object.keys(purple ?? {})).toHaveLength(11);
    expect(JSON.stringify(purple).match(/295\.0\)/gu)).toHaveLength(11);
  });

  it("sets body text a sixteenth larger than the foundation", () => {
    expect(tokens.fontSizes?.["md"]).toStrictEqual({ value: "1.0625rem" });
  });

  it("climbs the scale by a major third", () => {
    expect(tokens.fontSizes?.["lg"]).toStrictEqual({ value: `${(1.0625 * 1.25).toFixed(4)}rem` });
  });

  it("sets the body and the headings in a serif", () => {
    expect(JSON.stringify(tokens.fonts?.["body"])).toContain("Georgia");
    expect(tokens.fonts?.["heading"]).toStrictEqual(tokens.fonts?.["body"]);
  });
});
