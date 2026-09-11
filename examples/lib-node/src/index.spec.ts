import { expect, test } from "vite-plus/test";

import { listed } from "#index.ts";

test("answers nothing where there are no names", () => {
  expect(listed([])).toBe("");
});

test("answers the one name where there is one", () => {
  expect(listed(["Ada"])).toBe("Ada");
});

test("joins the last name with a word rather than a comma", () => {
  expect(listed(["Ada", "Grace", "Barbara"])).toBe("Ada, Grace and Barbara");
});
