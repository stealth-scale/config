import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, fielded } from "#field/field.fixtures.tsx";
import { Label } from "#field/label.tsx";
import { recipe } from "#field/recipe.ts";
import { type RootProps } from "#field/root.tsx";

describe("Label", () => {
  it("draws a label inside the field it needs above it", () => {
    const { container } = render(fielded(<Label>Email</Label>));

    expect(slotElement(container, "field", "label").tagName).toBe("LABEL");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "label",
      }),
    ).toStrictEqual([]);
  });

  it("points at the control, which is what names it and what moves focus on a press", () => {
    render(composed({ id: "email" }));

    expect(screen.getByText("Email").getAttribute("for")).toBe("email");
    expect(screen.getByRole("textbox").getAttribute("id")).toBe("email");
  });

  it("names the control by its own words", () => {
    render(composed());

    expect(screen.getByRole("textbox", { name: /Email/u })).toBeDefined();
  });

  it("is drawn as unreachable where the field is", () => {
    const { container } = render(composed({ disabled: true }));

    expect(slotElement(container, "field", "label").dataset["disabled"]).toBe("true");
  });
});
