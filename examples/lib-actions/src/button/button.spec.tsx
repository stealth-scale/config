import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { recipeClasses, recipeElement, variantClass } from "@stealthscale/testing-theme";

import { Button } from "#button/button.ts";

describe("Button", () => {
  it("conforms as a button element", () => {
    expect(violations(Button, { children: true, element: "BUTTON" })).toStrictEqual([]);
  });

  it("draws the recipe's class and the classes of the default variants", () => {
    const { container } = render(<Button>Go</Button>);

    expect(recipeClasses(container, "button")).toStrictEqual([
      "button",
      variantClass("button", "size", "md"),
      variantClass("button", "variant", "solid"),
    ]);
  });

  it("draws the class of the look a caller picks", () => {
    const { container } = render(<Button variant="ghost">Go</Button>);

    expect(recipeClasses(container, "button")).toContain(
      variantClass("button", "variant", "ghost"),
    );
  });

  it("draws the class of the status a caller picks", () => {
    const { container } = render(<Button status="error">Go</Button>);

    expect(recipeClasses(container, "button")).toContain(variantClass("button", "status", "error"));
  });

  it("renders the button element the recipe is bound to", () => {
    const { container } = render(<Button>Go</Button>);

    expect(recipeElement(container, "button").tagName).toBe("BUTTON");
  });
});
