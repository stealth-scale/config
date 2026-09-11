import { expect, test } from "vite-plus/test";

import { SELECTOR } from "#rules/selector.ts";

test("refuses an id selector outright rather than allowing a few", () => {
  expect(SELECTOR["selector-max-id"]).toBe(0);
});

test("refuses a class tied to the element it was first written against", () => {
  expect(SELECTOR["selector-no-qualifying-type"]).toBe(true);
});
