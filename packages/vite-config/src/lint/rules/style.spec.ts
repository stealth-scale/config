import { describe, expect, it } from "vitest";

import { STYLE } from "#lint/rules/style.ts";

describe("style", () => {
  it("configures each choice one way", () => {
    for (const [rule, severity] of Object.entries(STYLE)) {
      expect(severity, `${rule} is neither required nor refused`).toBeDefined();
      expect(severity).not.toBe("off");
    }
  });

  it("asks for a return type", () => {
    expect(STYLE["explicit-function-return-type"]).toBe("error");
  });
});
