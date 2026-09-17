import { describe, expect, it } from "vitest";

import { compilerConfig } from "#config.ts";

const RESOLVED = {
  separator: "-",
  theme: {
    recipes: {
      badge: { className: "badge" },
      button: {
        className: "button",
        variants: { loading: { false: {}, true: {} }, size: { lg: {}, sm: {} } },
      },
    },
    slotRecipes: {
      card: { className: "card", slots: ["root", "content"], variants: { bleed: { true: {} } } },
    },
  },
};

describe("compilerConfig", () => {
  it("reads every recipe and slot recipe with its class and its axes", () => {
    expect(compilerConfig(RESOLVED)).toStrictEqual({
      recipes: [
        { axes: [], className: "badge" },
        { axes: ["loading", "size"], className: "button" },
        { axes: ["bleed"], className: "card", slots: ["root", "content"] },
      ],
      separator: "-",
    });
  });

  it("takes the key as the class where the recipe names none", () => {
    const { recipes } = compilerConfig({ theme: { recipes: { badge: {} } } });

    expect(recipes).toStrictEqual([{ axes: [], className: "badge" }]);
  });

  it("reads no slots where the slot recipe lists none and keeps the strings of a list", () => {
    const { recipes } = compilerConfig({
      theme: { slotRecipes: { bare: { className: "bare" }, card: { slots: ["root", 1] } } },
    });

    expect(recipes).toStrictEqual([
      { axes: [], className: "bare", slots: [] },
      { axes: [], className: "card", slots: ["root"] },
    ]);
  });

  it("reads the compiler's default separator where the configuration sets none", () => {
    expect(compilerConfig({}).separator).toBe("_");
    expect(compilerConfig({ separator: "|" }).separator).toBe("_");
  });

  it("reads no recipes where the theme or its recipes are absent or not objects", () => {
    expect(compilerConfig({}).recipes).toStrictEqual([]);
    expect(compilerConfig({ theme: [] }).recipes).toStrictEqual([]);
    expect(compilerConfig({ theme: { recipes: "none" } }).recipes).toStrictEqual([]);
    expect(compilerConfig({ theme: { recipes: { badge: null } } }).recipes).toStrictEqual([
      { axes: [], className: "badge" },
    ]);
  });
});
