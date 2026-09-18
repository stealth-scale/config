import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#input/context.ts";

describe("context", () => {
  it("draws the recipe's class on an element it binds", () => {
    const Probe = withContext("input");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "input")).toContain("input");
  });

  it("hands a provider's variants to an element below it", () => {
    const Probe = withContext("input");
    const { container } = render(
      createElement(PropsProvider, { value: { variant: "subtle" } }, createElement(Probe)),
    );

    expect(recipeClasses(container, "input")).toContain(variantClass("input", "variant", "subtle"));
  });
});
