import { describe, expect, it } from "vitest";

import { HUES, PALETTES, ROLES } from "#authoring/contract.ts";
import { palettes } from "#preset/semantic-tokens/palettes.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("palettes", () => {
  it("fills every role of every hue palette from its own ramp", () => {
    for (const hue of HUES) {
      expect(ROLES.every((role) => tokenAt(palettes[hue], role) !== undefined)).toBe(true);
      expect(tokenAt(palettes[hue], "solid.DEFAULT")).toStrictEqual({
        _dark: `{colors.${hue}.400}`,
        base: `{colors.${hue}.700}`,
      });
    }
  });

  it("fills every role of every semantic palette by reference", () => {
    for (const palette of PALETTES) {
      expect(ROLES.every((role) => tokenAt(palettes[palette], role) !== undefined)).toBe(true);
    }
  });

  it("points the primary at the blue and the error at the red", () => {
    expect(tokenAt(palettes.primary, "solid.DEFAULT")).toBe("{colors.blue.solid}");
    expect(tokenAt(palettes.error, "fg.DEFAULT")).toBe("{colors.red.fg}");
  });

  it("points the neutral fills at the page's own surfaces", () => {
    expect(tokenAt(palettes.neutral, "muted")).toBe("{colors.bg.muted}");
    expect(tokenAt(palettes.neutral, "solid.DEFAULT")).toBe("{colors.gray.solid}");
  });
});
