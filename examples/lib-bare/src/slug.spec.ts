import { expect, test } from "vite-plus/test";

import { slug } from "#slug.ts";

test("lowers the case, a URL being read the same either way but written one", () => {
  expect(slug("Release Notes")).toBe("release-notes");
});

test("collapses a run of anything else into one separator", () => {
  expect(slug("one  --  two")).toBe("one-two");
});

test("leaves no separator at either end", () => {
  expect(slug("  edges  ")).toBe("edges");
});

test("answers nothing for a title holding nothing to keep", () => {
  expect(slug("!!!")).toBe("");
});
