import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Control } from "#field/control.tsx";
import { composed, fielded } from "#field/field.fixtures.tsx";
import { recipe } from "#field/recipe.ts";
import { type RootProps } from "#field/root.tsx";

describe("Control", () => {
  it("draws an input inside the field it needs above it", () => {
    const { container } = render(fielded(<Control />));

    expect(slotElement(container, "field", "control").tagName).toBe("INPUT");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "control",
      }),
    ).toStrictEqual([]);
  });

  it("takes the name the label gives it", () => {
    render(composed());

    expect(screen.getByRole("textbox", { name: /Email/u })).toBeDefined();
  });

  it("is described by both texts, so whichever is drawn is read", () => {
    render(composed({ id: "email" }));

    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBe(
      "email-helper email-error",
    );
  });

  it("marks itself wrong off the attribute a screen reader reads", () => {
    render(composed({ invalid: true }));

    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("takes the field's disabled state rather than a prop of its own", () => {
    render(composed({ disabled: true }));

    expect(screen.getByRole("textbox").hasAttribute("disabled")).toBe(true);
  });

  it("keeps a prop a caller states over the field's", () => {
    render(fielded(<Control aria-label="Its own name" />, { id: "email" }));

    expect(screen.getByRole("textbox", { name: "Its own name" })).toBeDefined();
  });

  it("draws the control as names, for a field holding something else", () => {
    const { container } = render(fielded(<Control as="textarea" />));

    expect(slotElement(container, "field", "control").tagName).toBe("TEXTAREA");
  });
});
