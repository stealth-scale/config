import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { ErrorText } from "#field/error-text.tsx";
import { composed, fielded } from "#field/field.fixtures.tsx";
import { recipe } from "#field/recipe.ts";
import { type RootProps } from "#field/root.tsx";

describe("ErrorText", () => {
  it("draws nothing where the field is not wrong", () => {
    render(fielded(<ErrorText>Wrong</ErrorText>));

    expect(screen.queryByText("Wrong")).toBeNull();
  });

  it("draws a p where the field is wrong", () => {
    const { container } = render(fielded(<ErrorText>Wrong</ErrorText>, { invalid: true }));

    expect(slotElement(container, "field", "errorText").tagName).toBe("P");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props: RootProps) => render(composed({ ...props, invalid: true })).container,
        { slot: "errorText" },
      ),
    ).toStrictEqual([]);
  });

  it("reaches a reader who is not looking at the field", () => {
    render(composed({ invalid: true }));

    expect(screen.getByRole("alert").textContent).toBe("That address is not one we recognise.");
  });

  it("carries the identifier the control is described by", () => {
    const { container } = render(composed({ id: "email", invalid: true }));

    expect(slotElement(container, "field", "errorText").getAttribute("id")).toBe("email-error");
  });
});
