import { describe, expect, it } from "vitest";

import { sized } from "#patterns/length.ts";

describe("sized", () => {
  it("reads a size token as the token with the name as its fallback", () => {
    expect(sized("40")).toBe("token(sizes.40, 40)");
    expect(sized("md")).toBe("token(sizes.md, md)");
  });

  it.each(["12rem", "50%", "var(--column)", "min(10rem, 100%)", "calc(100% - 2rem)"])(
    "reads %s as it stands",
    (width) => {
      expect(sized(width)).toBe(width);
    },
  );
});
