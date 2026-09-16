import { describe, expect, it } from "vitest";

import { controlSizes, iconOnly, iconSizes, touchTarget } from "#authoring/recipes/sizes.ts";

describe("sizes", () => {
  it("reads the four semantic scales for each control size", () => {
    expect(controlSizes(["sm", "md"])).toStrictEqual({
      md: { gap: "gap.md", height: "control.md", paddingInline: "inset.md", textStyle: "label.md" },
      sm: { gap: "gap.sm", height: "control.sm", paddingInline: "inset.sm", textStyle: "label.sm" },
    });
  });

  it("reads the icon scale for each icon size", () => {
    expect(iconSizes(["xs", "xl"])).toStrictEqual({
      xl: { boxSize: "icon.xl" },
      xs: { boxSize: "icon.xs" },
    });
  });

  it("draws a square control with no inset for each icon-only size", () => {
    expect(iconOnly(["md"])).toStrictEqual({ md: { boxSize: "control.md", padding: "0" } });
  });

  it("widens the hit area to a medium control under a coarse pointer alone", () => {
    expect(Object.keys(touchTarget())).toStrictEqual(["_touch"]);
    expect(touchTarget()).toMatchObject({
      _touch: {
        _after: { minBlockSize: "control.md", minInlineSize: "control.md", position: "absolute" },
        position: "relative",
      },
    });
  });
});
