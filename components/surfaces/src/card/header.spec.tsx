import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { Header } from "#card/header.ts";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Header", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(carded(<Header>Invoice</Header>));

    expect(slotElement(container, "card", "header").tagName).toBe("DIV");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "header",
      }),
    ).toStrictEqual([]);
  });

  it("carries no role because the title inside it states the heading", () => {
    const { container } = render(carded(<Header>Invoice</Header>));

    expect(slotElement(container, "card", "header").hasAttribute("role")).toBe(false);
  });
});
