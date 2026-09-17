import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { recipeClasses, variantClass } from "@stealthscale/testing-theme";

import { Candy } from "#candy.tsx";

describe("Candy", () => {
  it("heads the panel with the candy", () => {
    const { getByRole } = render(<Candy />);

    expect(getByRole("heading", { name: "Eye candy" })).toBeDefined();
  });

  it("runs the marquee words twice so the loop has no seam", () => {
    const { container } = render(<Candy />);

    expect(container.querySelectorAll("span")).toHaveLength(14);
  });

  it("draws the breathing button in the success palette", () => {
    const { container } = render(<Candy />);

    expect(recipeClasses(container, "button")).toContain(
      variantClass("button", "variant", "solid"),
    );
    expect(container.querySelectorAll("[data-recipe=button]")[1]?.className).toContain(
      variantClass("button", "status", "success"),
    );
  });

  it("draws three buttons of candy", () => {
    const { getByRole } = render(<Candy />);

    expect(getByRole("button", { name: "Rippling" }).className).toContain(
      variantClass("button", "variant", "subtle"),
    );
  });

  it("draws the same panel when it renders again", () => {
    const { container, rerender } = render(<Candy />);

    rerender(<Candy />);

    expect(container.querySelectorAll("span")).toHaveLength(14);
  });
});
