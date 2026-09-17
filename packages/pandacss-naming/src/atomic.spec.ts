import { describe, expect, it } from "vitest";

import { atomicClass, conditionsOf } from "#atomic.ts";

describe("atomicClass", () => {
  it.each([
    { give: "layerStyle-dim.others", want: "layer-style-dim-others" },
    { give: "textStyle-body.md", want: "text-style-body-md" },
    { give: "md:grid-tc-repeat(3,_minmax(0,_1fr))", want: "md:grid-tc-repeat-3-minmax-0-1fr" },
    { give: "focusVisible:c-red", want: "focus-visible:c-red" },
    { give: "hover:dark:c-pink", want: "hover:dark:c-pink" },
    { give: "2xl:c-blue", want: "2xl:c-blue" },
    { give: "wide:child:gap-3", want: "wide:child:gap-3" },
    { give: "ff-Segoe_UI,_sans-serif", want: "ff-Segoe-UI-sans-serif" },
  ])("rewrites $give as $want", ({ give, want }) => {
    expect(atomicClass(give)).toBe(want);
  });

  it("keeps a raw selector condition as written", () => {
    expect(atomicClass("[&_>_*]:c-red")).toBe("[&_>_*]:c-red");
  });

  it("keeps a raw at-rule condition with a colon inside its brackets as written", () => {
    expect(atomicClass("[@media_(min-width:_40rem)]:c-green")).toBe(
      "[@media_(min-width:_40rem)]:c-green",
    );
  });

  it("rewrites the utility under a raw condition", () => {
    expect(atomicClass("[&_>_*]:grid-ar-{sizes.32}")).toBe("[&_>_*]:grid-ar-sizes-32");
  });

  it("returns a class the scheme wrote unchanged", () => {
    expect(atomicClass("card__content--bleed")).toBe("card__content--bleed");
    expect(atomicClass("button--lg")).toBe("button--lg");
  });

  it("writes a slot named in camel case in kebab-case", () => {
    expect(atomicClass("card__contentBody")).toBe("card__content-body");
  });

  it("returns an empty string for an empty class", () => {
    expect(atomicClass("")).toBe("");
  });

  it("lists the conditions of a class outer to inner with a raw one in its brackets", () => {
    expect(conditionsOf("md:[@media_(min-width:_40rem)]:c-green")).toStrictEqual([
      "md",
      "[@media_(min-width:_40rem)]",
    ]);
  });

  it("lists no condition for a class without one", () => {
    expect(conditionsOf("c-red")).toStrictEqual([]);
  });
});
