import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#icon/context.ts";

describe("context", () => {
  it("draws the recipe's class on an element it binds", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "icon")).toContain("icon");
  });

  it("hands a provider's variants to an element below it", () => {
    const Probe = withContext("span");
    const { container } = render(
      createElement(PropsProvider, { value: { size: "lg" } }, createElement(Probe)),
    );

    expect(recipeClasses(container, "icon")).toContain(variantClass("icon", "size", "lg"));
  });
});
