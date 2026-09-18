import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#stack/context.ts";

describe("context", () => {
  it("draws the recipe's class on an element it binds", () => {
    const Probe = withContext("section");
    const { container } = render(createElement(Probe, null, "One"));

    expect(recipeClasses(container, "stack")).toContain("stack");
  });

  it("hands a provider's variants to an element below it", () => {
    const Probe = withContext("section");
    const { container } = render(
      createElement(PropsProvider, { value: { gap: "xl" } }, createElement(Probe, null, "One")),
    );

    expect(recipeClasses(container, "stack")).toContain(variantClass("stack", "gap", "xl"));
  });
});
