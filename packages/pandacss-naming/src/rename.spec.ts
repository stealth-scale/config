import { describe, expect, it } from "vitest";

import { type CompilerConfig } from "#recipe.ts";
import { rename } from "#rename.ts";

const CONFIG: CompilerConfig = {
  recipes: [
    { axes: ["loading", "size"], className: "button" },
    { axes: ["size"], className: "button-group" },
    { axes: ["bleed", "size"], className: "card", slots: ["content", "root"] },
  ],
  separator: "-",
};

describe("rename", () => {
  it("rewrites a string variant as the class and the value", () => {
    expect(rename("button--size-lg", CONFIG)).toBe("button--lg");
  });

  it("rewrites a boolean variant at true as the class and the axis", () => {
    expect(rename("button--loading-true", CONFIG)).toBe("button--loading");
  });

  it("returns an empty string for a boolean variant at false", () => {
    expect(rename("button--loading-false", CONFIG)).toBe("");
  });

  it("rewrites a variant on a slot", () => {
    expect(rename("card__content--bleed-true", CONFIG)).toBe("card__content--bleed");
    expect(rename("card__root--size-sm", CONFIG)).toBe("card__root--sm");
  });

  it("keeps a value that contains the separator whole", () => {
    expect(rename("button--size-extra-large", CONFIG)).toBe("button--extra-large");
  });

  it("returns a recipe's base class unchanged", () => {
    expect(rename("button", CONFIG)).toBe("button");
    expect(rename("card__root", CONFIG)).toBe("card__root");
  });

  it("returns a compound's class unchanged", () => {
    expect(rename("button--expose", CONFIG)).toBe("button--expose");
  });

  it("reads a recipe whose class starts with another recipe's class", () => {
    expect(rename("button-group--size-lg", CONFIG)).toBe("button-group--lg");
  });

  it("rewrites an atomic class no recipe claims", () => {
    expect(rename("md:grid-tc-repeat(3,_minmax(0,_1fr))", CONFIG)).toBe(
      "md:grid-tc-repeat-3-minmax-0-1fr",
    );
  });

  it("reads the separator the compiler was configured with", () => {
    expect(rename("button--size_lg", { ...CONFIG, separator: "_" })).toBe("button--lg");
    expect(rename("button--size=lg", { ...CONFIG, separator: "=" })).toBe("button--lg");
  });
});
