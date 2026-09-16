import { describe, expect, it } from "vitest";

import { breakpoints } from "#preset/breakpoints.ts";

describe("breakpoints", () => {
  it("lists five breakpoints in rem", () => {
    expect(Object.keys(breakpoints).toSorted()).toStrictEqual(["2xl", "lg", "md", "sm", "xl"]);
    expect(Object.values(breakpoints).every((width) => width.endsWith("rem"))).toBe(true);
  });

  it("widens from small to double extra large", () => {
    const widths = ["sm", "md", "lg", "xl", "2xl"].map((name) =>
      Number((breakpoints[name] ?? "").replace("rem", "")),
    );

    expect(widths).toStrictEqual([...widths].toSorted((a, b) => a - b));
  });
});
