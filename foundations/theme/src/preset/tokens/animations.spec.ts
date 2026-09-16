import { describe, expect, it } from "vitest";

import { animations } from "#preset/tokens/animations.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("animations", () => {
  it("names the four loops and the shimmer", () => {
    expect(Object.keys(animations).toSorted()).toStrictEqual([
      "bounce",
      "ping",
      "pulse",
      "shimmer",
      "spin",
    ]);
  });

  it("sweeps the shimmer at the slow ambient pace", () => {
    expect(tokenAt(animations, "shimmer")).toBe(
      "bg-position {durations.ambientSlow} linear infinite",
    );
  });
});
