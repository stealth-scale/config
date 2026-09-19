import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";
import { Title } from "#card/title.ts";

describe("Title", () => {
  it("draws an h3 inside the root it needs above it", () => {
    const { container } = render(carded(<Title>Invoice</Title>));

    expect(slotElement(container, "card", "title").tagName).toBe("H3");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "title",
      }),
    ).toStrictEqual([]);
  });

  it("is read as a heading at the third level", () => {
    render(carded(<Title>Invoice</Title>));

    expect(screen.getByRole("heading", { level: 3, name: "Invoice" })).toBeDefined();
  });

  it("draws the level a page's outline needs", () => {
    render(carded(<Title as="h2">Invoice</Title>));

    expect(screen.getByRole("heading", { level: 2, name: "Invoice" })).toBeDefined();
  });
});
