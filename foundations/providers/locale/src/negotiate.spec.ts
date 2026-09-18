import { describe, expect, it } from "vitest";

import { negotiate, preferences } from "#negotiate.ts";

describe("preferences", () => {
  it("returns an empty array when no header is given", () => {
    expect(preferences()).toStrictEqual([]);
  });

  it("returns an empty array for an empty header", () => {
    expect(preferences("  ")).toStrictEqual([]);
  });

  it("reads a tag with no quality as fully wanted", () => {
    expect(preferences("en-GB")).toStrictEqual([{ quality: 1, tag: "en-GB" }]);
  });

  it("orders the tags by quality", () => {
    expect(preferences("nl;q=0.8,en;q=0.9").map((one) => one.tag)).toStrictEqual(["en", "nl"]);
  });

  it("keeps the header's own order where two tags share a quality", () => {
    expect(preferences("nl;q=0.5,en;q=0.5").map((one) => one.tag)).toStrictEqual(["nl", "en"]);
  });

  it("canonicalises each tag", () => {
    expect(preferences("EN-gb").map((one) => one.tag)).toStrictEqual(["en-GB"]);
  });

  it("drops a tag the client refused with q=0", () => {
    expect(preferences("en,nl;q=0").map((one) => one.tag)).toStrictEqual(["en"]);
  });

  it("drops the wildcard", () => {
    expect(preferences("en,*").map((one) => one.tag)).toStrictEqual(["en"]);
  });

  it("drops a string that is not a tag", () => {
    expect(preferences("en,not a tag").map((one) => one.tag)).toStrictEqual(["en"]);
  });

  it("reads a quality that is not a number as fully wanted", () => {
    expect(preferences("en;q=high")).toStrictEqual([{ quality: 1, tag: "en" }]);
  });

  it("reads an empty quality as fully wanted", () => {
    expect(preferences("en;q=")).toStrictEqual([{ quality: 1, tag: "en" }]);
  });

  it("reads a quality above one as fully wanted", () => {
    expect(preferences("en;q=9")).toStrictEqual([{ quality: 1, tag: "en" }]);
  });
});

describe("negotiate", () => {
  it("returns the fallback when nothing was requested", () => {
    expect(negotiate([], ["en", "nl"], "en")).toBe("en");
  });

  it("returns the fallback when nothing matches", () => {
    expect(negotiate(["ja"], ["en", "nl"], "en")).toBe("en");
  });

  it("returns an exact match", () => {
    expect(negotiate(["nl"], ["en", "nl"], "en")).toBe("nl");
  });

  it("truncates a requested tag to reach a shorter offer", () => {
    expect(negotiate(["nl-BE"], ["en", "nl"], "en")).toBe("nl");
  });

  it("returns the offer as the application spelled it", () => {
    expect(negotiate(["nl-be"], ["en-US", "NL"], "en-US")).toBe("NL");
  });

  it("takes the first requested tag that matches", () => {
    expect(negotiate(["ja", "nl", "en"], ["en", "nl"], "en")).toBe("nl");
  });

  it("widens both sides to meet at a shared script", () => {
    expect(negotiate(["zh-HK"], ["zh-Hant", "en"], "en")).toBe("zh-Hant");
  });

  it("widens a bare tag to reach a scripted offer", () => {
    expect(negotiate(["zh"], ["zh-Hans", "en"], "en")).toBe("zh-Hans");
  });

  it("widens a region to reach another region of the same language", () => {
    expect(negotiate(["en-GB"], ["en-US"], "en-US")).toBe("en-US");
  });

  it("keeps the first of two offers that canonicalise the same", () => {
    expect(negotiate(["nl"], ["nl", "NL"], "en")).toBe("nl");
  });

  it("keeps the first of two offers that widen through a shared step", () => {
    expect(negotiate(["zh"], ["zh-Hant", "zh-Hant-HK"], "en")).toBe("zh-Hant");
  });

  it("skips an offer that is not a tag", () => {
    expect(negotiate(["nl"], ["not a tag", "nl"], "en")).toBe("nl");
  });
});
