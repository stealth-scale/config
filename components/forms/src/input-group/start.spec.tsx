import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, grouped } from "#input-group/input-group.fixtures.tsx";
import { recipe } from "#input-group/recipe.ts";
import { type RootProps } from "#input-group/root.ts";
import { Start } from "#input-group/start.ts";

describe("Start", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(grouped(<Start>€</Start>));

    expect(slotElement(container, "input-group", "start").tagName).toBe("DIV");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "start",
      }),
    ).toStrictEqual([]);
  });

  it("draws what a caller puts in it", () => {
    const { container } = render(grouped(<Start>€</Start>));

    expect(slotElement(container, "input-group", "start").textContent).toBe("€");
  });

  it("keeps a decorative mark out of what a screen reader reads", () => {
    const { container } = render(grouped(<Start aria-hidden>€</Start>));

    expect(slotElement(container, "input-group", "start").getAttribute("aria-hidden")).toBe("true");
  });
});
