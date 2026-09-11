import { expect, test } from "vite-plus/test";

import * as lint from "#lint/index.ts";

test("publishes the presets a config picks from, under one name", () => {
  expect(Object.keys(lint.preset).toSorted()).toEqual(["base", "node", "web"]);
});

test("publishes the verbs a repository adds one at a time, beside them", () => {
  for (const verb of ["defaultExported", "forbid", "relax", "undocumented"]) {
    expect(Object.keys(lint), `${verb} is not published`).toContain(verb);
  }
});

test("withholds the rule groups, so a rule can move between them unnoticed", () => {
  for (const name of ["CATEGORIES", "DOCBLOCK", "PLUGINS", "SAFETY", "SIZE", "STYLE"]) {
    expect(Object.keys(lint), `${name} is published`).not.toContain(name);
  }
});
