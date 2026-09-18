import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { PropsProvider, withContext } from "#frame/context.ts";

describe("context", () => {
  it("draws the recipe's class on an element it binds", () => {
    const Probe = withContext("figure");
    const { container } = render(createElement(Probe, null, "One"));

    expect(recipeClasses(container, "frame")).toContain("frame");
  });

  it("hands a provider's shape to an element below it", () => {
    const Probe = withContext("figure");
    const { container } = render(
      createElement(
        PropsProvider,
        { value: { ratio: "video" } },
        createElement(Probe, null, "One"),
      ),
    );

    expect(recipeClasses(container, "frame")).toContain(variantClass("frame", "ratio", "video"));
  });
});
