import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, recipeClasses, slotElement } from "@stealthscale/testing-theme";

import { Field } from "#input-group/field.ts";
import { composed, grouped } from "#input-group/input-group.fixtures.tsx";
import { recipe } from "#input-group/recipe.ts";
import { type RootProps } from "#input-group/root.ts";

describe("Field", () => {
  it("draws an input inside the root it needs above it", () => {
    const { container } = render(grouped(<Field aria-label="Amount" />));

    expect(slotElement(container, "input-group", "field").tagName).toBe("INPUT");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "field",
      }),
    ).toStrictEqual([]);
  });

  it("keeps the text field's own class beside the slot's", () => {
    const { container } = render(grouped(<Field aria-label="Amount" />));

    expect(recipeClasses(container, "input")).toContain("input");
  });

  it("is reachable by its accessible name", () => {
    render(composed());

    expect(screen.getByRole("textbox", { name: "Amount" })).toBeDefined();
  });

  it("draws the control as names, for a group holding something other than a field", () => {
    const { container } = render(grouped(<Field aria-label="Amount" as="button" />));

    expect(slotElement(container, "input-group", "field").tagName).toBe("BUTTON");
  });
});
