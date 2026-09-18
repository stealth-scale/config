import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#skeleton/context.ts";

describe("context", () => {
  it("draws the recipe's class on an element it binds", () => {
    const Probe = withContext("div");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "skeleton")).toContain("skeleton");
  });

  it("hands a provider's variants to an element below it", () => {
    const Probe = withContext("div");
    const { container } = render(
      createElement(PropsProvider, { value: { motion: "shimmer" } }, createElement(Probe)),
    );

    expect(recipeClasses(container, "skeleton")).toContain(
      variantClass("skeleton", "motion", "shimmer"),
    );
  });
});
