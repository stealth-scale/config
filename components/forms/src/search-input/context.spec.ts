import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext } from "#search-input/context.ts";

describe("context", () => {
  it("draws the recipe's class on an element it binds", () => {
    const Probe = withContext("button");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "search-input")).toContain("search-input");
  });

  it("writes the class of a size a caller picks", () => {
    const Probe = withContext("button");
    const { container } = render(createElement(Probe, { size: "lg" }));

    expect(recipeClasses(container, "search-input")).toContain(
      variantClass("search-input", "size", "lg"),
    );
  });
});
