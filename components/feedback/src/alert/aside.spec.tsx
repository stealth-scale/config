import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { Aside } from "#alert/aside.ts";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";

describe("Aside", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(alerted(<Aside>Dismiss</Aside>));

    expect(slotElement(container, "alert", "aside").tagName).toBe("DIV");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "aside",
      }),
    ).toStrictEqual([]);
  });

  it("puts a control it holds in reach of a keyboard under the name the caller gave it", () => {
    render(composed());

    expect(screen.getByRole("button", { name: "Dismiss this warning" })).toBeDefined();
  });
});
