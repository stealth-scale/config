import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { Content } from "#card/content.ts";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Content", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(carded(<Content>Three lines</Content>));

    expect(slotElement(container, "card", "content").tagName).toBe("DIV");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "content",
      }),
    ).toStrictEqual([]);
  });

  it("carries no role because the band groups nothing a reader navigates by", () => {
    const { container } = render(carded(<Content>Three lines</Content>));

    expect(slotElement(container, "card", "content").hasAttribute("role")).toBe(false);
  });
});
