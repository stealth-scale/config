import { expect, test } from "vite-plus/test";

import { DOCBLOCK, DOCBLOCK_SETTINGS, docblocksOff, TSDOC_TAGS } from "#lint/rules/docblock.ts";

/**
 * The rules that would require a tag into existence rather than check one that is there.
 */
const FORCED = ["jsdoc-js/require-param", "jsdoc-js/require-returns", "jsdoc-js/require-template"];

test("asks for a block on everything named, exported or not", () => {
  expect(DOCBLOCK["jsdoc-js/require-jsdoc"]).toBeDefined();
});

test("requires no tag into existence, which is what manufactures filler", () => {
  for (const rule of FORCED) {
    expect(Object.keys(DOCBLOCK)).not.toContain(rule);
  }
});

test("requires the one tag a signature cannot carry", () => {
  expect(DOCBLOCK["jsdoc-js/require-throws"]).toBe("error");
});

test("checks what a tag does carry, so an absent rule is not a licence for filler", () => {
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

test("refuses a type in a tag, which is the whole of TSDoc against JSDoc", () => {
  expect(DOCBLOCK["jsdoc-js/no-types"]).toBe("error");
});

test("asks a second plugin whether the block parses at all", () => {
  expect(DOCBLOCK["tsdoc/syntax"]).toBe("error");
});

test("turns every rule off rather than a list somebody has to remember to extend", () => {
  const off = docblocksOff();

  expect(Object.keys(off)).toEqual(Object.keys(DOCBLOCK));
  expect(Object.values(off).every((held) => held === "off")).toBe(true);
});

test("maps each JSDoc spelling to the TSDoc one, making the JSDoc name an error", () => {
  expect(TSDOC_TAGS).toMatchObject({
    file: "packageDocumentation",
    return: "returns",
    template: "typeParam",
  });
});

test("tells the plugin it is reading TypeScript, so a brace is not read as a type", () => {
  expect(DOCBLOCK_SETTINGS.jsdoc.mode).toBe("typescript");
});

test("tells it the tag names too, since the two have to agree", () => {
  expect(DOCBLOCK_SETTINGS.jsdoc.tagNamePreference).toBe(TSDOC_TAGS);
});
