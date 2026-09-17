import { describe, expect, it } from "vitest";

import { memoryStore, readSetting, writeSetting } from "@stealthscale/settings";

import { COLOR_MODE_SETTING, COLOR_MODES, colorModeSetting, DARK_SCHEME_QUERY } from "#setting.ts";

describe("colorModeSetting", () => {
  it("names the setting the provider and the inline script agree on", () => {
    expect(colorModeSetting().name).toBe(COLOR_MODE_SETTING);
  });

  it("follows the machine until somebody chooses", () => {
    expect(colorModeSetting().fallback).toBe("system");
  });

  it("allows both modes a person can pick", () => {
    expect([...colorModeSetting().values]).toStrictEqual([...COLOR_MODES]);
  });

  it("keeps a chosen mode in the store it is given", () => {
    const setting = colorModeSetting(memoryStore());

    writeSetting("docs", setting, "dark");

    expect(setting.store.read("stealth.docs.color-mode")).toBe("dark");
  });

  it("reads a chosen mode back", () => {
    const setting = colorModeSetting(memoryStore({ "stealth.docs.color-mode": "light" }));

    expect(readSetting("docs", setting)).toBe("light");
  });

  it("follows the machine again for a stored value that is not a mode", () => {
    const setting = colorModeSetting(memoryStore({ "stealth.docs.color-mode": "sepia" }));

    expect(readSetting("docs", setting)).toBe("system");
  });

  it("keeps the choice in the page's own storage where a caller names no store", () => {
    expect(colorModeSetting().store).toBe(colorModeSetting().store);
  });

  it("asks the machine for the setting the platform publishes", () => {
    expect(DARK_SCHEME_QUERY).toBe("(prefers-color-scheme: dark)");
  });
});
