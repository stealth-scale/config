import { describe, expect, it } from "vitest";

import { fonts } from "#preset/tokens/fonts.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("fonts", () => {
  it("sets the body and the headings in the system sans-serif stack", () => {
    expect(String(tokenAt(fonts, "body"))).toMatch(/^ui-sans-serif, system-ui/u);
    expect(tokenAt(fonts, "heading")).toBe(tokenAt(fonts, "body"));
  });

  it("sets code in the system monospaced stack", () => {
    expect(String(tokenAt(fonts, "mono"))).toMatch(/^ui-monospace/u);
  });
});
