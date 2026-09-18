import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { Indicator } from "#card/indicator.ts";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Indicator", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(carded(<Indicator>●</Indicator>));

    expect(slotElement(container, "card", "indicator").tagName).toBe("DIV");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "indicator",
      }),
    ).toStrictEqual([]);
  });

  it("keeps a decorative mark out of what a screen reader reads", () => {
    const { container } = render(carded(<Indicator aria-hidden>●</Indicator>));

    expect(slotElement(container, "card", "indicator").getAttribute("aria-hidden")).toBe("true");
  });
});
