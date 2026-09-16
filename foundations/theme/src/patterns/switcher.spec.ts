import { describe, expect, it } from "vitest";

import { switcher } from "#patterns/switcher.ts";

describe("switcher", () => {
  it("switches at thirty rem with the medium gap when nothing is stated", () => {
    expect(switcher()).toStrictEqual({
      "& > *": { flexBasis: "calc((30rem - 100%) * 999)", flexGrow: 1 },
      display: "flex",
      flexWrap: "wrap",
      gap: "gap.md",
    });
  });

  it("switches at the threshold it was given", () => {
    expect(switcher({ gap: "gap.sm", threshold: "40rem" })).toMatchObject({
      "& > *": { flexBasis: "calc((40rem - 100%) * 999)" },
      gap: "gap.sm",
    });
  });
});
