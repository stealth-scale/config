import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { Indicator } from "#alert/indicator.ts";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";

describe("Indicator", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(alerted(<Indicator>!</Indicator>));

    expect(slotElement(container, "alert", "indicator").tagName).toBe("DIV");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "indicator",
      }),
    ).toStrictEqual([]);
  });

  it("keeps the mark out of what a screen reader reads", () => {
    const { container } = render(alerted(<Indicator>!</Indicator>));

    expect(slotElement(container, "alert", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("reads the mark out where a caller says it carries something the words do not", () => {
    const { container } = render(alerted(<Indicator aria-hidden={false}>!</Indicator>));

    expect(slotElement(container, "alert", "indicator").getAttribute("aria-hidden")).toBe("false");
  });
});
