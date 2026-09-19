import { describe, expect, it } from "vitest";

import { BASE_SIZE, pixelsOf, sizesOf, widthOf } from "#size.ts";

describe("pixelsOf", () => {
  it("converts a length in rem against the engine's own root font size", () => {
    expect(pixelsOf("30rem")).toBe(480);
  });

  it("converts a length in em the same way", () => {
    expect(pixelsOf("48em")).toBe(768);
  });

  it("takes a length in pixels as it stands", () => {
    expect(pixelsOf("480px")).toBe(480);
  });

  it("takes a bare number as pixels", () => {
    expect(pixelsOf("480")).toBe(480);
  });

  it("answers no width for a breakpoint that states no start", () => {
    const absent: null | string | undefined = undefined;

    expect(pixelsOf(absent)).toBe(0);
    expect(pixelsOf(null)).toBe(0);
  });
});

describe("sizesOf", () => {
  it("names every breakpoint the design system states above base", () => {
    expect(sizesOf().map(({ name }) => name)).toStrictEqual(["sm", "md", "lg", "xl", "2xl"]);
  });

  it("leaves base out because it starts at nothing and has no token", () => {
    expect(sizesOf().map(({ name }) => name)).not.toContain(BASE_SIZE.name);
  });

  it("reads each start in pixels", () => {
    expect(sizesOf()[0]).toStrictEqual({ min: 640, name: "sm" });
  });

  it("orders them narrowest first", () => {
    const widths = sizesOf().map(({ min }) => min);

    expect(widths).toStrictEqual(widths.toSorted((one, other) => one - other));
  });
});

describe("BASE_SIZE", () => {
  it("starts at no width at all", () => {
    expect(BASE_SIZE).toStrictEqual({ min: 0, name: "base" });
  });
});

describe("widthOf", () => {
  it("reads the width a breakpoint starts at", () => {
    expect(widthOf("sm")).toBe(640);
  });

  it("answers nothing for the breakpoint every theme starts at", () => {
    expect(widthOf("base")).toBe(0);
  });

  it("answers a wider number for a wider breakpoint", () => {
    expect(widthOf("lg")).toBeGreaterThan(widthOf("sm"));
  });

  it("answers the same number the size list holds", () => {
    expect(widthOf("md")).toBe(sizesOf().find((size) => size.name === "md")?.min);
  });
});
