import { describe, expect, it } from "vitest";

import * as pack from "#pack/index.ts";

describe("vite-config", () => {
  it("publishes the presets a package picks from", () => {
    expect(Object.keys(pack.preset).toSorted()).toStrictEqual(["base", "node", "web"]);
  });

  it("publishes the layers a package adds one at a time", () => {
    for (const verb of [
      "carry",
      "command",
      "declarations",
      "entry",
      "hook",
      "platform",
      "published",
      "quality",
      "source",
      "subpaths",
    ]) {
      expect(Object.keys(pack), `${verb} is not published`).toContain(verb);
    }
  });

  it("exports nothing that exists only for another layer to reuse", () => {
    expect(Object.keys(pack), "carrying is published").not.toContain("carrying");
  });
});
