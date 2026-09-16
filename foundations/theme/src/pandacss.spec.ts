import { describe, expect, expectTypeOf, it } from "vitest";

import * as pandacss from "#pandacss.ts";

describe("pandacss", () => {
  it("exports nothing at run time and re-exports the compiler's types", () => {
    expect(Object.keys(pandacss)).toStrictEqual([]);

    expectTypeOf<pandacss.Preset>().toHaveProperty("name");
  });
});
