import { expect, test } from "vite-plus/test";

import * as pack from "#pack/index.ts";

test("publishes the presets a package picks from, under one name", () => {
  expect(Object.keys(pack.preset).toSorted()).toEqual(["base", "node", "web"]);
});

test("publishes the layers a package states one at a time, beside them", () => {
  for (const verb of [
    "carry",
    "command",
    "declarations",
    "entry",
    "hook",
    "platform",
    "published",
    "quality",
    "ships",
    "source",
  ]) {
    expect(Object.keys(pack), `${verb} is not published`).toContain(verb);
  }
});

test("withholds what exists only so another layer can reuse it", () => {
  expect(Object.keys(pack), "carrying is published").not.toContain("carrying");
});
