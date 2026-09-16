/**
 * Specifies which doc comment rules run and which tags are never forced.
 */

import { describe, expect, it } from "vitest";

import { DOCBLOCK, DOCBLOCK_SETTINGS, docblocksOff, TSDOC_TAGS } from "#lint/rules/docblock.ts";

const FORCED = ["jsdoc-js/require-param", "jsdoc-js/require-returns", "jsdoc-js/require-template"];

describe("docblock", () => {
  it("asks for a block on every named declaration exported or not", () => {
    expect(DOCBLOCK["jsdoc-js/require-jsdoc"]).toBeDefined();
  });

  it("writes no block itself", () => {
    const [, stated] = DOCBLOCK["jsdoc-js/require-jsdoc"] as [string, { enableFixer: boolean }];

    expect(stated.enableFixer).toBe(false);
  });

  it("requires no tag into existence", () => {
    for (const rule of FORCED) {
      expect(Object.keys(DOCBLOCK)).not.toContain(rule);
    }
  });

  it("requires the one tag a signature cannot express", () => {
    expect(DOCBLOCK["jsdoc-js/require-throws"]).toBe("error");
  });

  it("checks the text a tag does carry", () => {
    for (const rule of [
      "jsdoc-js/check-param-names",
      "jsdoc-js/informative-docs",
      "jsdoc-js/require-description",
      "jsdoc-js/require-description-complete-sentence",
      "jsdoc-js/require-param-description",
    ]) {
      expect(DOCBLOCK[rule]).toBeDefined();
    }
  });

  it("refuses a type in a tag", () => {
    expect(DOCBLOCK["jsdoc-js/no-types"]).toBe("error");
  });

  it("asks a second plugin whether the block parses at all", () => {
    expect(DOCBLOCK["tsdoc/syntax"]).toBe("error");
  });

  it("turns every rule off rather than a list somebody has to remember to extend", () => {
    const off = docblocksOff();

    expect(Object.keys(off)).toStrictEqual(Object.keys(DOCBLOCK));
    expect(Object.values(off).every((held) => held === "off")).toBe(true);
  });

  it("maps each JSDoc spelling to the TSDoc one", () => {
    expect(TSDOC_TAGS).toMatchObject({
      file: "packageDocumentation",
      return: "returns",
      template: "typeParam",
    });
  });

  it("tells the plugin it is reading TypeScript", () => {
    expect(DOCBLOCK_SETTINGS.jsdoc.mode).toBe("typescript");
  });

  it("tells it the tag names too", () => {
    expect(DOCBLOCK_SETTINGS.jsdoc.tagNamePreference).toBe(TSDOC_TAGS);
  });
});
