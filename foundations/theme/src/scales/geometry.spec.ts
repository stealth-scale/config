import { describe, expect, it } from "vitest";

import { controls, gaps, icons, insets } from "#scales/geometry.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("geometry", () => {
  it.each([controls, icons, insets, gaps])("draws five steps with %o", (scale) => {
    expect(Object.keys(scale()).toSorted()).toStrictEqual(["lg", "md", "sm", "xl", "xs"]);
  });

  it("draws a medium control at the base it was given", () => {
    expect(tokenAt(controls(), "md")).toBe("2.5000rem");
    expect(tokenAt(controls(3), "md")).toBe("3.0000rem");
  });

  it("draws the control steps a tenth apart", () => {
    expect(tokenAt(controls(), "xs")).toBe("2.0000rem");
    expect(tokenAt(controls(), "xl")).toBe("3.0000rem");
  });

  it("draws an icon box from three fifths to eight fifths of the base", () => {
    expect(tokenAt(icons(), "xs")).toBe("0.7500rem");
    expect(tokenAt(icons(), "md")).toBe("1.2500rem");
    expect(tokenAt(icons(), "xl")).toBe("2.0000rem");
  });

  it("draws the inset from half to one and a half times the base", () => {
    expect(tokenAt(insets(), "xs")).toBe("0.5000rem");
    expect(tokenAt(insets(), "xl")).toBe("1.5000rem");
  });

  it("draws the gap from half to twice the base", () => {
    expect(tokenAt(gaps(), "xs")).toBe("0.2500rem");
    expect(tokenAt(gaps(), "xl")).toBe("1.0000rem");
  });
});
