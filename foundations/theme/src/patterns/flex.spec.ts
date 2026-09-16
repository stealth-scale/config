import { describe, expect, it } from "vitest";

import { center, flex } from "#patterns/flex.ts";

describe("flex", () => {
  it("draws a flex container and nothing else when nothing is stated", () => {
    expect(flex()).toStrictEqual({ display: "flex" });
  });

  it("maps each prop to the flex property it stands for", () => {
    expect(
      flex({
        align: "center",
        basis: "0",
        direction: "column",
        grow: 1,
        justify: "center",
        shrink: 0,
        wrap: "wrap",
      }),
    ).toStrictEqual({
      alignItems: "center",
      display: "flex",
      flexBasis: "0",
      flexDirection: "column",
      flexGrow: 1,
      flexShrink: 0,
      flexWrap: "wrap",
      justifyContent: "center",
    });
  });

  it("centres a child on both axes", () => {
    expect(center()).toStrictEqual({
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
    });
  });

  it("centres inline when asked", () => {
    expect(center({ inline: true })).toMatchObject({ display: "inline-flex" });
  });
});
