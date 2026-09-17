import { describe, expect, it } from "vitest";

import { presetViolations } from "@stealthscale/testing-theme";

import preset from "#theme.ts";

describe("theme", () => {
  it("registers every recipe file under its class name", () => {
    expect(presetViolations(preset, { at: import.meta.dirname })).toStrictEqual([]);
  });

  it("names the application that states it", () => {
    expect(preset.name).toBe("@stealthscale/example-theme-multiple");
  });
});
