import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, fielded } from "#field/field.fixtures.tsx";
import { recipe } from "#field/recipe.ts";
import { RequiredIndicator } from "#field/required-indicator.tsx";
import { type RootProps } from "#field/root.tsx";

describe("RequiredIndicator", () => {
  it("draws nothing where the field is optional", () => {
    render(fielded(<RequiredIndicator />));

    expect(screen.queryByText("*")).toBeNull();
  });

  it("draws a span where the field has to be filled in", () => {
    const { container } = render(fielded(<RequiredIndicator />, { required: true }));

    expect(slotElement(container, "field", "requiredIndicator").tagName).toBe("SPAN");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props: RootProps) => render(composed({ ...props, required: true })).container,
        { slot: "requiredIndicator" },
      ),
    ).toStrictEqual([]);
  });

  it("stays out of what a screen reader reads", () => {
    const { container } = render(composed({ required: true }));

    expect(slotElement(container, "field", "requiredIndicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });
});
