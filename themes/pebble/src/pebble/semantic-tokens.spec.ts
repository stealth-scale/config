import { describe, expect, it } from "vitest";

import { semanticTokens } from "#pebble/semantic-tokens.ts";

describe("semanticTokens", () => {
  it("points the primary palette at the gray ramp", () => {
    expect(semanticTokens.colors.primary.solid.DEFAULT.value).toBe("{colors.gray.solid}");
  });

  it("points the error palette at the red ramp", () => {
    expect(semanticTokens.colors.error.solid.DEFAULT.value).toBe("{colors.red.solid}");
  });

  it("fixes the roundest corner at 0.625rem", () => {
    expect(semanticTokens.radii?.["l3"]).toStrictEqual({ value: "0.625rem" });
  });

  it("states a shadow in both modes", () => {
    expect(semanticTokens.shadows?.["md"]).toHaveProperty("value.base");
    expect(semanticTokens.shadows?.["md"]).toHaveProperty("value._dark");
  });
});
