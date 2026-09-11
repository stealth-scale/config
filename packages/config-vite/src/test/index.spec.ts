import { expect, test } from "vite-plus/test";

import * as suite from "#test/index.ts";

test("publishes the presets a package picks from, under one name", () => {
  expect(Object.keys(suite.preset).toSorted()).toEqual(["base", "node", "web"]);
});

test("publishes the layers a package states one at a time, beside them", () => {
  for (const verb of [
    "assertion",
    "browser",
    "coverage",
    "environment",
    "files",
    "isolation",
    "order",
    "projects",
  ]) {
    expect(Object.keys(suite), `${verb} is not published`).toContain(verb);
  }
});

test("publishes the three a repository states with a reason, which take one back", () => {
  for (const verb of ["covering", "globalSetup", "uncounted"]) {
    expect(Object.keys(suite), `${verb} is not published`).toContain(verb);
  }
});
