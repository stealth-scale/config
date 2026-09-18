import { describe, expect, it, vi } from "vitest";

import { browserLanguages } from "#browser.ts";

/**
 * Reads the languages with one value standing in for the browser's navigator.
 *
 * @param navigator - What `globalThis.navigator` is while the read runs.
 * @returns The tags the read produced.
 */
function asked(navigator: unknown): readonly string[] {
  vi.stubGlobal("navigator", navigator);

  const languages = browserLanguages();

  vi.unstubAllGlobals();

  return languages;
}

describe("browserLanguages", () => {
  it("returns the languages the browser asks for", () => {
    expect(asked({ languages: ["en-GB", "nl"] })).toStrictEqual(["en-GB", "nl"]);
  });

  it("returns an empty array when there is no navigator", () => {
    expect(asked(null)).toStrictEqual([]);
  });

  it("returns an empty array when the navigator lists no language", () => {
    expect(asked({})).toStrictEqual([]);
  });
});
