import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#divider/context.ts";

describe("context", () => {
  it("draws the recipe's class on an element it binds", () => {
    const Probe = withContext("div");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "divider")).toContain("divider");
  });

  it("hands a provider's direction to an element below it", () => {
    const Probe = withContext("div");
    const { container } = render(
      createElement(PropsProvider, { value: { orientation: "vertical" } }, createElement(Probe)),
    );

    expect(recipeClasses(container, "divider")).toContain(
      variantClass("divider", "orientation", "vertical"),
    );
  });
});
