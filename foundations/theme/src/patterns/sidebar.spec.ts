import { describe, expect, it } from "vitest";

import { sidebar } from "#patterns/sidebar.ts";

describe("sidebar", () => {
  it("puts the pane first and gives the content half the row when nothing is stated", () => {
    expect(sidebar()).toStrictEqual({
      "& > :first-child": { flexBasis: "sm", flexGrow: 1 },
      "& > :last-child": { flexBasis: "0", flexGrow: 999, minInlineSize: "50%" },
      display: "flex",
      flexWrap: "wrap",
      gap: "gap.lg",
    });
  });

  it("puts the pane last when the side is the end", () => {
    expect(sidebar({ side: "end" })).toMatchObject({
      "& > :first-child": { flexGrow: 999 },
      "& > :last-child": { flexBasis: "sm", flexGrow: 1 },
    });
  });

  it("takes the pane width and the content share it was given", () => {
    expect(sidebar({ contentMin: 60, sideWidth: "20rem" })).toMatchObject({
      "& > :first-child": { flexBasis: "20rem" },
      "& > :last-child": { minInlineSize: "60%" },
    });
  });

  it("computes the content share once per breakpoint", () => {
    expect(sidebar({ contentMin: { base: 100, md: 50 } })).toMatchObject({
      "& > :last-child": { minInlineSize: { base: "100%", md: "50%" } },
    });
  });
});
