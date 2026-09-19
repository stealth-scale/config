import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#mark/context.ts";

describe("context", () => {
  it("draws the recipe's class on an element it binds", () => {
    const Probe = withContext("span");
    const { container } = render(createElement(Probe, null, "hit"));

    expect(recipeClasses(container, "mark")).toContain("mark");
  });

  it("hands a provider's variants to an element below it", () => {
    const Probe = withContext("span");
    const { container } = render(
      createElement(
        PropsProvider,
        { value: { variant: "solid" } },
        createElement(Probe, null, "hit"),
      ),
    );

    expect(recipeClasses(container, "mark")).toContain(variantClass("mark", "variant", "solid"));
  });
});
