import { describe, expect, expectTypeOf, it } from "vitest";

import * as application from "#authoring/application.ts";
import { type Theme } from "#authoring/theme.ts";

describe("Application", () => {
  it("exports nothing at run time and leaves the themes optional", () => {
    expect(Object.keys(application)).toStrictEqual([]);

    expectTypeOf<application.Application["themes"]>().toExtend<readonly Theme[] | undefined>();
    expectTypeOf<Record<string, never>>().toExtend<application.Application>();
    expectTypeOf<application.Application>().toExtend<{ static?: unknown }>();
  });
});
