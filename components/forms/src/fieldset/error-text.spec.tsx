import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { ErrorText } from "#fieldset/error-text.tsx";
import { composed, grouped } from "#fieldset/fieldset.fixtures.tsx";
import { recipe } from "#fieldset/recipe.ts";
import { type RootProps } from "#fieldset/root.tsx";

describe("ErrorText", () => {
  it("draws nothing where the group is not wrong", () => {
    render(grouped(<ErrorText>Choose one</ErrorText>));

    expect(screen.queryByText("Choose one")).toBeNull();
  });

  it("draws a p where the group is wrong", () => {
    const { container } = render(grouped(<ErrorText>Choose one</ErrorText>, { invalid: true }));

    expect(slotElement(container, "fieldset", "errorText").tagName).toBe("P");
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

  it("reaches a reader who is not looking at the group", () => {
    render(composed({ invalid: true }));

    expect(screen.getByRole("alert").textContent).toBe("Choose one before going on.");
  });
});
