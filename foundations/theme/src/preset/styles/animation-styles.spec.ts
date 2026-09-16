import { describe, expect, it } from "vitest";

import { animationStyles } from "#preset/styles/animation-styles.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("animationStyles", () => {
  it("names an entering and a leaving form of each motion and the shimmer", () => {
    expect(Object.keys(animationStyles).toSorted()).toStrictEqual([
      "collapse",
      "fade",
      "scale-fade",
      "shimmer",
      "slide-fade",
    ]);
    expect(Object.keys(tokenAt(animationStyles, "fade") ?? {})).toStrictEqual(["in", "out"]);
  });

  it("runs a fade in at the moderate pace and out at the fast pace", () => {
    expect(tokenAt(animationStyles, "fade.in")).toMatchObject({
      animationDuration: "moderate",
      animationName: "fade-in",
      animationTimingFunction: "out",
    });
    expect(tokenAt(animationStyles, "fade.out")).toMatchObject({
      animationDuration: "fast",
      animationName: "fade-out",
      animationTimingFunction: "in",
    });
  });

  it("turns every motion off for a reader who asked for less", () => {
    for (const path of ["fade.in", "scale-fade.out", "collapse.in", "slide-fade.in", "shimmer"]) {
      expect(tokenAt(animationStyles, path)).toMatchObject({
        _motionReduce: { animation: "none" },
      });
    }
  });

  it("slides in from the side the placement is on", () => {
    expect(tokenAt(animationStyles, "slide-fade.in")).toMatchObject({
      "&[data-placement^=bottom]": { animationName: "slide-from-top, fade-in" },
      "&[data-placement^=left]": { animationName: "slide-from-right, fade-in" },
      "&[data-placement^=top]": { animationName: "slide-from-bottom, fade-in" },
      transformOrigin: "var(--transform-origin)",
    });
  });

  it("slides out towards the side the placement is on", () => {
    expect(tokenAt(animationStyles, "slide-fade.out")).toMatchObject({
      "&[data-placement^=right]": { animationName: "slide-to-right, fade-out" },
      "&[data-placement^=top]": { animationName: "slide-to-top, fade-out" },
    });
  });

  it("sweeps the shimmer at the slow ambient pace without easing", () => {
    expect(tokenAt(animationStyles, "shimmer")).toMatchObject({
      animationDuration: "ambientSlow",
      animationIterationCount: "infinite",
      animationName: "bg-position",
      animationTimingFunction: "linear",
    });
  });
});
