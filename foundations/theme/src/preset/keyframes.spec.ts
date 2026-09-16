import { describe, expect, it } from "vitest";

import { keyframes } from "#preset/keyframes.ts";
import { animations } from "#preset/tokens/animations.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("keyframes", () => {
  it("draws the four loops", () => {
    expect(Object.keys(keyframes)).toStrictEqual(
      expect.arrayContaining(["spin", "pulse", "ping", "bounce"]),
    );
  });

  it("draws the fades and the scales in and out", () => {
    expect(Object.keys(keyframes)).toStrictEqual(
      expect.arrayContaining(["fade-in", "fade-out", "scale-in", "scale-out"]),
    );
  });

  it("expands and collapses a panel on both axes from a measured size", () => {
    expect(keyframes["expand-height"]).toStrictEqual({
      from: { height: "var(--collapsed-height, 0)" },
      to: { height: "var(--height)" },
    });
    expect(keyframes["collapse-width"]).toStrictEqual({
      from: { width: "var(--width)" },
      to: { width: "var(--collapsed-width, 0)" },
    });
  });

  it("draws the sixteen slides", () => {
    expect(Object.keys(keyframes).filter((name) => name.startsWith("slide-"))).toHaveLength(16);
  });

  it("defines a keyframe for every animation token", () => {
    const named = Object.keys(animations).map(
      (name) => String(tokenAt(animations, name)).split(" ")[0],
    );

    expect(named.every((name) => name !== undefined && name in keyframes)).toBe(true);
  });
});
