import { describe, expect, it } from "vitest";

import { canonical, chain, directionOf, parts, widened, widenedChain } from "#tags.ts";

describe("canonical", () => {
  it("corrects the case of each subtag", () => {
    expect(canonical("ZH-hant-tw")).toBe("zh-Hant-TW");
  });

  it("returns undefined for a string that is not a tag", () => {
    expect(canonical("not a tag")).toBeUndefined();
  });
});

describe("parts", () => {
  it("splits a tag into its subtags", () => {
    expect(parts("zh-Hant-TW")).toStrictEqual({
      language: "zh",
      region: "TW",
      script: "Hant",
    });
  });

  it("returns undefined for the script and region a tag omits", () => {
    expect(parts("nl")).toStrictEqual({ language: "nl", region: undefined, script: undefined });
  });

  it("returns undefined for a string that is not a tag", () => {
    expect(parts("not a tag")).toBeUndefined();
  });
});

describe("widened", () => {
  it("adds the script and region the engine considers likely", () => {
    expect(widened("zh")).toBe("zh-Hans-CN");
  });

  it("returns undefined for a string that is not a tag", () => {
    expect(widened("not a tag")).toBeUndefined();
  });
});

describe("chain", () => {
  it("truncates a tag from most specific to least", () => {
    expect(chain("zh-Hant-TW")).toStrictEqual(["zh-Hant-TW", "zh-Hant", "zh"]);
  });

  it("returns one step for a tag with one subtag", () => {
    expect(chain("nl")).toStrictEqual(["nl"]);
  });

  it("drops an extension rather than truncating it", () => {
    expect(chain("de-DE-u-co-phonebk")).toStrictEqual(["de-DE", "de"]);
  });

  it("returns an empty array for a string that is not a tag", () => {
    expect(chain("not a tag")).toStrictEqual([]);
  });
});

describe("directionOf", () => {
  it.each(["ar", "he", "fa", "ur", "dv"])("returns rtl for %s", (tag) => {
    expect(directionOf(tag)).toBe("rtl");
  });

  it.each(["en", "nl", "zh", "ja"])("returns ltr for %s", (tag) => {
    expect(directionOf(tag)).toBe("ltr");
  });

  it("returns ltr for a right-to-left language written in Latin script", () => {
    expect(directionOf("ar-Latn")).toBe("ltr");
  });

  it("returns ltr for a string that is not a tag", () => {
    expect(directionOf("not a tag")).toBe("ltr");
  });
});

describe("widenedChain", () => {
  it("widens a tag before truncating it", () => {
    expect(widenedChain("zh-HK")).toStrictEqual(["zh-Hant-HK", "zh-Hant", "zh"]);
  });

  it("returns an empty array for a string that is not a tag", () => {
    expect(widenedChain("not a tag")).toStrictEqual([]);
  });
});
