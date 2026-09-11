import { expect, test } from "vite-plus/test";

import { SIZE } from "#lint/rules/size.ts";

test("counts neither blank lines nor comments, so a docblock never costs a split", () => {
  for (const rule of ["max-lines", "max-lines-per-function"]) {
    expect(SIZE[rule]).toEqual([
      "error",
      expect.objectContaining({ skipBlankLines: true, skipComments: true }),
    ]);
  }
});

test("limits a function more tightly than a file, since a file may hold several", () => {
  const [, file] = SIZE["max-lines"] as [string, { max: number }];
  const [, held] = SIZE["max-lines-per-function"] as [string, { max: number }];

  expect(held.max).toBeLessThan(file.max);
});
