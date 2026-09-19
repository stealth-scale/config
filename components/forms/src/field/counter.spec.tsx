import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Counter } from "#field/counter.tsx";
import { composed, fielded } from "#field/field.fixtures.tsx";
import { recipe } from "#field/recipe.ts";
import { type RootProps } from "#field/root.tsx";

describe("Counter", () => {
  it("draws a p inside the field it needs above it", () => {
    const { container } = render(fielded(<Counter>12 / 80</Counter>));

    expect(slotElement(container, "field", "counter").tagName).toBe("P");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "counter",
      }),
    ).toStrictEqual([]);
  });

  it("announces the count when the reader pauses rather than at every keystroke", () => {
    const { container } = render(fielded(<Counter>12 / 80</Counter>));

    expect(slotElement(container, "field", "counter").getAttribute("aria-live")).toBe("polite");
  });

  it("stays out of the text the control is described by", () => {
    render(composed({ id: "email" }));

    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toBe(
      "email-helper email-error",
    );
  });

  it("draws the count a caller passes and measures nothing", () => {
    render(fielded(<Counter>12 / 80</Counter>));

    expect(screen.getByText("12 / 80")).toBeDefined();
  });
});
