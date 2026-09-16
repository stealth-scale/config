import { describe, expect, expectTypeOf, it } from "vitest";

import * as application from "#authoring/application.ts";
import { type Theme } from "#authoring/theme.ts";

describe("Application", () => {
  it("exports nothing at run time and requires at least one theme", () => {
    expect(Object.keys(application)).toStrictEqual([]);

    expectTypeOf<application.Application["themes"]>().toExtend<readonly [Theme, ...Theme[]]>();
    expectTypeOf<application.Application>().toExtend<{ static?: unknown }>();
  });
});
