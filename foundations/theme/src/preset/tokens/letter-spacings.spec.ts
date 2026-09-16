import { describe, expect, it } from "vitest";

import { letterSpacings } from "#preset/tokens/letter-spacings.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("letterSpacings", () => {
  it("lists six trackings in em", () => {
    expect(Object.keys(letterSpacings)).toHaveLength(6);
    expect(
      Object.values(letterSpacings).every((token) =>
        String(tokenAt({ token }, "token")).endsWith("em"),
      ),
    ).toBe(true);
  });

  it("runs from tighter to widest through normal at nought", () => {
    expect(tokenAt(letterSpacings, "tighter")).toBe("-0.05em");
    expect(tokenAt(letterSpacings, "normal")).toBe("0em");
    expect(tokenAt(letterSpacings, "widest")).toBe("0.1em");
  });
});
