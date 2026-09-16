import { describe, expect, it } from "vitest";

import { modedAt, tokenAt } from "#tokens.fixtures.ts";

describe("tokenAt", () => {
  it("unwraps the value of a token at a dotted path", () => {
    expect(tokenAt({ colors: { bg: { value: "white" } } }, "colors.bg")).toBe("white");
  });

  it("returns the group when the path stops above a token", () => {
    expect(tokenAt({ colors: { bg: { value: "white" } } }, "colors")).toStrictEqual({
      bg: { value: "white" },
    });
  });

  it("returns undefined when the path leaves the tree", () => {
    expect(tokenAt({ colors: {} }, "colors.bg.value")).toBeUndefined();
  });

  it("reads a value in one mode when the token carries both", () => {
    expect(modedAt({ bg: { value: { _dark: "black", base: "white" } } }, "bg", "_dark")).toBe(
      "black",
    );
  });

  it("reads the single value when the token carries one", () => {
    expect(modedAt({ bg: { value: "white" } }, "bg", "_dark")).toBe("white");
  });
});
