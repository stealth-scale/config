import { describe, expect, it } from "vitest";

import { BODY, RATIO, tokens } from "#prism/tokens.ts";

describe("tokens", () => {
  it("sets the body face to Source Sans 3 Variable", () => {
    expect(tokens.fonts?.["body"]?.value).toContain("Source Sans 3 Variable");
  });

  it("sets the body size to 0.875rem", () => {
    expect(tokens.fontSizes?.["md"]).toStrictEqual({ value: `${BODY.toFixed(4)}rem` });
  });

  it("climbs the scale by the fitted ratio", () => {
    expect(tokens.fontSizes?.["lg"]).toStrictEqual({ value: `${(BODY * RATIO).toFixed(4)}rem` });
  });

  it("carries every ramp", () => {
    expect(Object.keys(tokens.colors ?? {})).toHaveLength(11);
  });
});
