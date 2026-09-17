import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { recipeClasses, recipeElement, variantClass } from "@stealthscale/testing-theme";

import { Code } from "#code/code.ts";

describe("Code", () => {
  it("conforms as a code element", () => {
    expect(violations(Code, { as: true, children: true, element: "CODE" })).toStrictEqual([]);
  });

  it("draws the recipe's class and the classes of the default variants", () => {
    const { container } = render(<Code>npm</Code>);

    expect(recipeClasses(container, "code")).toStrictEqual([
      "code",
      variantClass("code", "size", "md"),
      variantClass("code", "variant", "subtle"),
    ]);
  });

  it("draws the class of the look a caller picks", () => {
    const { container } = render(<Code variant="solid">npm</Code>);

    expect(recipeClasses(container, "code")).toContain(variantClass("code", "variant", "solid"));
  });

  it("draws the class of the size a caller picks", () => {
    const { container } = render(<Code size="sm">npm</Code>);

    expect(recipeClasses(container, "code")).toContain(variantClass("code", "size", "sm"));
  });

  it("draws the class of the status a caller picks", () => {
    const { container } = render(<Code status="error">npm</Code>);

    expect(recipeClasses(container, "code")).toContain(variantClass("code", "status", "error"));
  });

  it("draws the element as names", () => {
    const { container } = render(<Code as="kbd">npm</Code>);

    expect(recipeElement(container, "code").tagName).toBe("KBD");
  });
});
