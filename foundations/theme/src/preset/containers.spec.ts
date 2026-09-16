import { describe, expect, it } from "vitest";

import { containers } from "#preset/containers.ts";

describe("containers", () => {
  it("lists fourteen sizes in rem", () => {
    expect(Object.keys(containers)).toHaveLength(14);
    expect(Object.values(containers).every((width) => width.endsWith("rem"))).toBe(true);
  });

  it("runs from sixteen rem to ninety", () => {
    expect(containers["3xs"]).toBe("16rem");
    expect(containers["8xl"]).toBe("90rem");
  });
});
