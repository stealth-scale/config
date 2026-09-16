import { describe, expect, it } from "vitest";

import { divider, surface } from "#authoring/recipes/surface.ts";

describe("surface", () => {
  it("draws a panel lifted a little when nothing is stated", () => {
    expect(surface()).toStrictEqual({
      background: "bg.panel",
      borderColor: "border",
      borderRadius: "l2",
      borderWidth: "sm",
      boxShadow: "sm",
      color: "fg",
    });
  });

  it("lifts the panel to the level it was given", () => {
    expect(surface("xl")).toMatchObject({ boxShadow: "xl" });
  });

  it("draws a hairline across the page when nothing is stated", () => {
    expect(divider()).toStrictEqual({
      borderBlockEndWidth: "sm",
      borderColor: "border",
      inlineSize: "100%",
    });
  });

  it("draws a hairline down the page when asked", () => {
    expect(divider("vertical")).toStrictEqual({
      alignSelf: "stretch",
      borderColor: "border",
      borderInlineEndWidth: "sm",
    });
  });
});
