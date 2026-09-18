import { describe, expect, it } from "vitest";

import * as tanstack from "#tanstack.ts";

describe("tanstack", () => {
  it("re-exports the hook factory a component package binds fields with", () => {
    expect(tanstack.createFormHook).toBeTypeOf("function");
  });

  it("re-exports the validation logic the defaults are built on", () => {
    expect(tanstack.revalidateLogic).toBeTypeOf("function");
  });
});
