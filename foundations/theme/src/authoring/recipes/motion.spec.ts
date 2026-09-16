import { describe, expect, it } from "vitest";

import { motion } from "#authoring/recipes/motion.ts";

describe("motion", () => {
  it("reads one animation style when open and another when closed", () => {
    expect(motion("fade.in", "fade.out")).toStrictEqual({
      _closed: { animationStyle: "fade.out" },
      _open: { animationStyle: "fade.in" },
    });
  });
});
