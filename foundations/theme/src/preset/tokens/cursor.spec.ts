import { describe, expect, it } from "vitest";

import { cursor } from "#preset/tokens/cursor.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("cursor", () => {
  it("draws a button and a switch with the hand", () => {
    expect(tokenAt(cursor, "button")).toBe("pointer");
    expect(tokenAt(cursor, "switch")).toBe("pointer");
  });

  it("draws a form control with the arrow", () => {
    for (const name of ["checkbox", "radio", "menuitem", "option", "slider"]) {
      expect(tokenAt(cursor, name)).toBe("default");
    }
  });

  it("refuses a disabled control", () => {
    expect(tokenAt(cursor, "disabled")).toBe("not-allowed");
  });
});
