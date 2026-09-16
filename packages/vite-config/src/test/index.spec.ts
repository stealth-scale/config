import { describe, expect, it } from "vitest";

import * as suite from "#test/index.ts";

describe("vite-config", () => {
  it("publishes the presets a package picks from", () => {
    expect(Object.keys(suite.preset).toSorted()).toStrictEqual(["base", "node", "web"]);
  });

  it("publishes the layers a package adds one at a time", () => {
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

  it("publishes the three layers a repository adds for itself", () => {
    for (const verb of ["omit", "prepare", "thresholds"]) {
      expect(Object.keys(suite), `${verb} is not published`).toContain(verb);
    }
  });
});
