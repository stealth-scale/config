import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { Badge } from "#badge/badge.ts";

describe("Badge", () => {
  it("conforms as a span element", () => {
    expect(violations(Badge, { children: true, element: "SPAN" })).toStrictEqual([]);
  });

  it("draws the recipe's class and the class of the default look", () => {
    const { container } = render(<Badge>New</Badge>);

    expect(recipeClasses(container, "badge")).toStrictEqual([
      "badge",
      variantClass("badge", "variant", "subtle"),
    ]);
  });

  it("draws the class of the look a caller picks", () => {
    const { container } = render(<Badge variant="solid">New</Badge>);

    expect(recipeClasses(container, "badge")).toContain(variantClass("badge", "variant", "solid"));
  });
});
