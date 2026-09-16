/**
 * Specifies how the size limits count lines and how they stand to each other.
 */

import { describe, expect, it } from "vitest";

import { SIZE } from "#lint/rules/size.ts";

describe("size", () => {
  it("counts neither blank lines nor comments", () => {
    for (const rule of ["max-lines", "max-lines-per-function"]) {
      expect(SIZE[rule]).toStrictEqual([
        "error",
        expect.objectContaining({ skipBlankLines: true, skipComments: true }),
      ]);
    }
  });

  it("limits a function more tightly than a file", () => {
    const [, file] = SIZE["max-lines"] as [string, { max: number }];
    const [, held] = SIZE["max-lines-per-function"] as [string, { max: number }];

    expect(held.max).toBeLessThan(file.max);
  });
});
