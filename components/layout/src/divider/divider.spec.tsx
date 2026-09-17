import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Divider } from "#divider/divider.ts";
import { recipe } from "#divider/recipe.ts";

describe("Divider", () => {
  it("conforms as a rule element", () => {
    expect(violations(Divider, { as: true, element: "HR" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(accessibilityViolations(Divider)).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Divider {...props} />).container),
    ).toStrictEqual([]);
  });

  it("is a separator a reader is told about", () => {
    const { getByRole } = render(<Divider />);

    expect(getByRole("separator")).toBeDefined();
  });

  it("states the direction it runs in where a caller stands it up", () => {
    const { container } = render(<Divider aria-orientation="vertical" orientation="vertical" />);

    expect(recipeElement(container, "divider").getAttribute("aria-orientation")).toBe("vertical");
  });
});
