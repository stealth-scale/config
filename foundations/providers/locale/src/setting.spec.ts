import { describe, expect, it, vi } from "vitest";

import { memoryStore } from "@stealthscale/settings";

import { LOCALE_SETTING, localeSetting } from "#setting.ts";

/**
 * Declares the setting with the browser asking for one set of languages.
 *
 * @param languages - What the browser asks for.
 * @param locales - What the application offers.
 * @returns The fallback the setting would use.
 */
function fallbackFor(
  languages: readonly string[],
  locales: readonly [string, ...string[]],
): string {
  vi.stubGlobal("navigator", { languages });

  const { fallback } = localeSetting(locales);

  vi.unstubAllGlobals();

  return fallback;
}

describe("localeSetting", () => {
  it("names the setting locale", () => {
    expect(localeSetting(["en"]).name).toBe(LOCALE_SETTING);
  });

  it("allows every locale the application offers", () => {
    expect([...localeSetting(["en", "nl"]).values]).toStrictEqual(["en", "nl"]);
  });

  it("falls back to the best offer for what the browser asks for", () => {
    expect(fallbackFor(["nl-BE"], ["en", "nl"])).toBe("nl");
  });

  it("falls back to the first offer where the browser asks for nothing it has", () => {
    expect(fallbackFor(["ja"], ["en", "nl"])).toBe("en");
  });

  it("keeps the store it is given", () => {
    const store = memoryStore();

    expect(localeSetting(["en"], store).store).toBe(store);
  });
});
