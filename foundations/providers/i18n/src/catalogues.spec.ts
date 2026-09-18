import { describe, expect, expectTypeOf, it } from "vitest";

import { SMALL } from "#catalogues.fixtures.ts";
import { type Catalogues, NONE, type Words } from "#catalogues.ts";

describe("Catalogues", () => {
  it("allows words nested to any depth", () => {
    expectTypeOf<Words[string]>().toEqualTypeOf<string | Words>();

    expect(SMALL.bundled["en"]?.["overlays"]?.["nested"]).toStrictEqual({
      close: "Close {{what}}",
    });
  });

  it("lists every language a catalogue was found for", () => {
    expectTypeOf<Catalogues["load"]>().returns.resolves.toEqualTypeOf<undefined | Words>();

    expect(SMALL.languages).toStrictEqual(["en", "nl"]);
  });

  it("points defaults at the fallback language's bundle", () => {
    expect(SMALL.defaults).toBe(SMALL.bundled["en"]);
  });
});

describe("NONE", () => {
  it("declares no language and no namespace", () => {
    expect(NONE).toMatchObject({
      bundled: {},
      defaults: {},
      fallback: "en",
      languages: [],
      namespaces: [],
    });
  });

  it("resolves load to undefined", async () => {
    await expect(NONE.load("en", "overlays")).resolves.toBeUndefined();
  });
});
