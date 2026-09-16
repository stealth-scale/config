/**
 * Checks the root-level call for its layer names, their order, and what it leaves out.
 */

import { describe, expect, it } from "vitest";

import { workspace } from "#workspace.ts";

describe("workspace", () => {
  it("names every layer for the call a consumer wrote under this package's own name", () => {
    expect(workspace().map((one) => one.name)).toStrictEqual([
      "react.fmt.imports",
      "react.lint.plugins(react)",
      "react.lint.plugins(jsx-a11y)",
      "react.lint.rules",
      "react.lint.runtime",
      "react.lint.rendered",
      "react.lint.fixtures",
    ]);
  });

  it("lists the rules before the relaxations", () => {
    const names = workspace().map((one) => one.name);

    expect(names.indexOf("react.lint.rules")).toBeLessThan(names.indexOf("react.lint.fixtures"));
    expect(names.indexOf("react.lint.rules")).toBeLessThan(names.indexOf("react.lint.rendered"));
  });

  it("declares the format and the rules", () => {
    const held = workspace().map((one) => one.kind);

    expect(held).toContain("override");
    expect(held).toContain("contribution");
    expect(held).not.toContain("preset");
  });

  it("packs and builds nothing", () => {
    const held = workspace()
      .map((one) => one.name)
      .join();

    expect(held).not.toContain("pack.");
    expect(held).not.toContain("build.");
  });
});
