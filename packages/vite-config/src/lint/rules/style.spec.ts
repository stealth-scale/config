/**
 * Specifies that every style choice is stated and none of them is off.
 */

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

  it("refuses an import of the toolchain and of its subpaths", () => {
    expect(STYLE["no-restricted-imports"]).toStrictEqual([
      "error",
      {
        paths: [
          { message: "Import vite. ADR-0006 names the toolchain nowhere else.", name: "vite-plus" },
        ],
        patterns: [
          {
            group: ["vite-plus/*"],
            message: "Import vitest or vite. ADR-0006 names the toolchain nowhere else.",
          },
        ],
      },
    ]);
  });
});
