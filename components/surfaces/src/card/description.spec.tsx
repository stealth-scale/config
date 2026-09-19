import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { Description } from "#card/description.ts";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Description", () => {
  it("draws a p inside the root it needs above it", () => {
    const { container } = render(carded(<Description>Issued today</Description>));

    expect(slotElement(container, "card", "description").tagName).toBe("P");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "description",
      }),
    ).toStrictEqual([]);
  });

  it("draws what a caller puts in it", () => {
    const { container } = render(carded(<Description>Issued today</Description>));

    expect(slotElement(container, "card", "description").textContent).toBe("Issued today");
  });
});
