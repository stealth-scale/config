import { describe, expect, it } from "vitest";

import { camelCased, isToken, leaves, nodeAt, stated } from "#tokens.ts";

const BLOCK = {
  bg: { DEFAULT: { value: "white" }, panel: { value: { _dark: "black", base: "white" } } },
  solid: { value: "blue" },
};

describe("tokens", () => {
  it("reports an object with a value as a token", () => {
    expect(isToken({ value: "x" })).toBe(true);
    expect(isToken({ DEFAULT: { value: "x" } })).toBe(false);
    expect(isToken("x")).toBe(false);
  });

  it("lists every token under a block with its dotted path", () => {
    expect(leaves(BLOCK)).toStrictEqual([
      { path: "bg.DEFAULT", value: "white" },
      { path: "bg.panel", value: { _dark: "black", base: "white" } },
      { path: "solid", value: "blue" },
    ]);
  });

  it("lists nothing under a value that is not a block", () => {
    expect(leaves("x")).toStrictEqual([]);
    expect(leaves()).toStrictEqual([]);
  });

  it("reads the node a dotted path reaches", () => {
    expect(nodeAt(BLOCK, "bg.panel")).toStrictEqual({ value: { _dark: "black", base: "white" } });
    expect(nodeAt(BLOCK, "bg.nope")).toBeUndefined();
    expect(nodeAt(BLOCK, "solid.value.deeper")).toBeUndefined();
  });

  it("reports a path stated outright or as a group's own value", () => {
    expect(stated(BLOCK, "solid")).toBe(true);
    expect(stated(BLOCK, "bg")).toBe(true);
    expect(stated(BLOCK, "bg.panel")).toBe(true);
    expect(stated(BLOCK, "bg.nope")).toBe(false);
  });

  it("writes a kebab-case name in camel case", () => {
    expect(camelCased("button-group")).toBe("buttonGroup");
    expect(camelCased("button")).toBe("button");
    expect(camelCased("h-1")).toBe("h1");
  });
});
