import { describe, expect, it } from "vitest";

import { splitMenuVariants } from "#menu/variants.ts";

describe("splitMenuVariants", () => {
  it("takes the recipe's axes out of what the root was handed", () => {
    const [picked] = splitMenuVariants({ highlight: "bar", size: "sm" });

    expect(picked).toStrictEqual({ highlight: "bar", size: "sm" });
  });

  it("leaves everything the element takes behind", () => {
    const [, rest] = splitMenuVariants({ className: "wide", size: "sm" });

    expect(rest).toStrictEqual({ className: "wide" });
  });

  it("offers every axis the recipe names", () => {
    const [picked] = splitMenuVariants({
      highlight: "fill",
      inset: true,
      size: "lg",
      variant: "glass",
    });

    expect(Object.keys(picked).toSorted()).toStrictEqual(["highlight", "inset", "size", "variant"]);
  });

  it("takes nothing where the root was handed no axis at all", () => {
    const [picked, rest] = splitMenuVariants({ children: "Rename" });

    expect(picked).toStrictEqual({});
    expect(rest).toStrictEqual({ children: "Rename" });
  });
});
