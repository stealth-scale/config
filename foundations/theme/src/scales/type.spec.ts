import { describe, expect, it } from "vitest";

import { fontSizes, typography } from "#scales/type.ts";
import { tokenAt } from "#tokens.fixtures.ts";

const STEPS = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"];

function styleOf(name: string, property: string): string {
  return String(Reflect.get(tokenAt(typography(), name) ?? {}, property));
}

describe("type", () => {
  it("draws a size for every rung of the scale", () => {
    expect(Object.keys(fontSizes())).toStrictEqual(STEPS);
  });

  it("puts the body size where the theme stated it", () => {
    expect(tokenAt(fontSizes(), "md")).toBe("1.0000rem");
    expect(tokenAt(fontSizes(1.25), "md")).toBe("1.2500rem");
  });

  it("spaces the rungs by the ratio it was given", () => {
    expect(tokenAt(fontSizes(1, 1.5), "lg")).toBe("1.5000rem");
  });

  it("draws a smaller rung below the body size", () => {
    expect(Number(String(tokenAt(fontSizes(), "sm")).replace("rem", ""))).toBeLessThan(1);
  });

  it("draws a text style for every rung the sizes have", () => {
    expect(Object.keys(typography())).toStrictEqual(STEPS);
  });

  it("states the size by name with the leading and the tracking it is read at", () => {
    expect(tokenAt(typography(), "md")).toStrictEqual({
      fontSize: "md",
      letterSpacing: "0em",
      lineHeight: "1.5",
    });
  });

  it("names the size token of the same rung", () => {
    expect(styleOf("3xl", "fontSize")).toBe("3xl");
    expect(Object.keys(fontSizes())).toContain("3xl");
  });

  it("tightens the leading as the size grows", () => {
    expect(Number(styleOf("7xl", "lineHeight"))).toBeLessThan(Number(styleOf("sm", "lineHeight")));
    expect(styleOf("7xl", "lineHeight")).toBe("1.1");
  });

  it("tightens the tracking at display sizes alone", () => {
    expect(styleOf("md", "letterSpacing")).toBe("0em");
    expect(styleOf("xl", "letterSpacing")).toBe("-0.01em");
    expect(styleOf("4xl", "letterSpacing")).toBe("-0.02em");
  });
});
