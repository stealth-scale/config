/**
 * Checks the import group for its name, its kind, and the reason it carries.
 */

import { describe, expect, it } from "vitest";

import { imports } from "#fmt/imports.ts";

describe("imports", () => {
  it("names the layer for the call a consumer wrote", () => {
    expect(imports().name).toBe("react.fmt.imports");
  });

  it("is an override layer", () => {
    expect(imports().kind).toBe("override");
  });

  it("gives a reason a later reader can weigh", () => {
    expect(imports().because).toContain("renders");
  });
});
