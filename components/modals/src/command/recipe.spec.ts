import { describe, expect, it } from "vitest";

import { axesOf, defaultsOf, recipeViolations } from "@stealthscale/testing-theme";

import { recipe } from "#command/recipe.ts";

describe("recipe", () => {
  it("writes no value a theme cannot move", () => {
    expect(
      recipeViolations(recipe, {
        names: ["Command"],
        parts: ["root", "control", "indicator", "input", "list", "empty", "shortcut"],
      }),
    ).toStrictEqual([]);
  });

  it("names its class command", () => {
    expect(recipe.className).toBe("command");
  });

  it("styles the seven parts a palette draws", () => {
    expect(recipe.slots).toStrictEqual([
      "root",
      "control",
      "indicator",
      "input",
      "list",
      "empty",
      "shortcut",
    ]);
  });

  it("offers the one axis a palette takes", () => {
    expect(axesOf(recipe)).toStrictEqual(["size"]);
  });

  it("draws a palette at the middle size when nothing is asked for", () => {
    expect(defaultsOf(recipe)).toStrictEqual({ size: "md" });
  });

  it("draws no edge round the field", () => {
    expect(recipe.base?.["input"]).toMatchObject({ borderStyle: "none", outline: "none" });
  });

  it("scrolls the rows rather than the panel", () => {
    expect(recipe.base?.["list"]).toMatchObject({ overflowY: "auto" });
    expect(recipe.base?.["root"]).not.toHaveProperty("overflowY");
  });

  it("tracks every tag under the Command namespace", () => {
    expect(recipe.jsx).toStrictEqual([/^Command(\.\w+)?$/u]);
  });
});
