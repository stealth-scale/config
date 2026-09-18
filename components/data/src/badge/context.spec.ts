import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#badge/context.ts";

describe("context", () => {
  it("draws the recipe's class on an element it binds", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(Probe, null, "New"));

    expect(recipeClasses(container, "badge")).toContain("badge");
  });

  it("hands a provider's variants to an element below it", () => {
    const Probe = withContext("span");
    const { container } = render(
      createElement(
        PropsProvider,
        { value: { variant: "outline" } },
        createElement(Probe, null, "New"),
      ),
    );

    expect(recipeClasses(container, "badge")).toContain(
      variantClass("badge", "variant", "outline"),
    );
  });
});
