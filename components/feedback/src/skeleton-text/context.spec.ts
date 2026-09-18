import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#skeleton-text/context.ts";

describe("context", () => {
  it("draws the recipe's class on an element it binds", () => {
    const Probe = withContext("div");
    const { container } = render(createElement(Probe));

    expect(recipeClasses(container, "skeleton-text")).toContain("skeleton-text");
  });

  it("publishes a provider for whatever sets the column's props from above", () => {
    const Probe = withContext("div");
    const { container } = render(createElement(PropsProvider, { value: {} }, createElement(Probe)));

    expect(recipeClasses(container, "skeleton-text")).toContain("skeleton-text");
  });
});
