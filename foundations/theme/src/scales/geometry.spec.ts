import { describe, expect, it } from "vitest";

import { controls, gaps, icons, insets } from "#scales/geometry.ts";
import { tokenAt } from "#tokens.fixtures.ts";

const STEPS = ["2xl", "3xl", "4xl", "lg", "md", "sm", "xl", "xs"];

describe("geometry", () => {
  it.each([controls, icons, insets, gaps])("draws eight steps with %o", (scale) => {
    expect(Object.keys(scale()).toSorted()).toStrictEqual(STEPS);
  });

  it("draws a medium control at the base it was given", () => {
    expect(tokenAt(controls(), "md")).toBe("2.5000rem");
    expect(tokenAt(controls(3), "md")).toBe("3.0000rem");
  });

  it("draws the control steps a tenth apart up to xl and twice the base at 4xl", () => {
    expect(tokenAt(controls(), "xs")).toBe("2.0000rem");
    expect(tokenAt(controls(), "xl")).toBe("3.0000rem");
    expect(tokenAt(controls(), "2xl")).toBe("3.5000rem");
    expect(tokenAt(controls(), "4xl")).toBe("5.0000rem");
  });

  it("draws an icon box from three fifths to three times the base", () => {
    expect(tokenAt(icons(), "xs")).toBe("0.7500rem");
    expect(tokenAt(icons(), "md")).toBe("1.2500rem");
    expect(tokenAt(icons(), "xl")).toBe("2.0000rem");
    expect(tokenAt(icons(), "4xl")).toBe("3.7500rem");
  });

  it("draws the inset from half to three times the base", () => {
    expect(tokenAt(insets(), "xs")).toBe("0.5000rem");
    expect(tokenAt(insets(), "xl")).toBe("1.5000rem");
    expect(tokenAt(insets(), "4xl")).toBe("3.0000rem");
  });

  it("draws the gap from half to six times the base", () => {
    expect(tokenAt(gaps(), "xs")).toBe("0.2500rem");
    expect(tokenAt(gaps(), "xl")).toBe("1.0000rem");
    expect(tokenAt(gaps(), "4xl")).toBe("3.0000rem");
  });
});
