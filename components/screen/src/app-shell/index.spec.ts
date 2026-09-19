import { describe, expect, it } from "vitest";

import * as barrel from "#app-shell/index.ts";

describe("index", () => {
  it("names every part a caller composes and every hook it reads the shell through", () => {
    expect(Object.keys(barrel).toSorted()).toStrictEqual([
      "Aside",
      "Body",
      "COLLAPSES",
      "FOLDS",
      "Footer",
      "Header",
      "Main",
      "Navbar",
      "Root",
      "Trigger",
      "useAppShellPanel",
      "useNearestPanel",
      "useOverlaid",
    ]);
  });

  it("publishes neither the recipe nor the binding", () => {
    expect.hasAssertions();

    for (const name of Object.keys(barrel)) {
      expect(name).not.toMatch(/^(?:recipe|with|panel|PANEL|STICKY)/u);
    }
  });
});
