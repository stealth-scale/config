import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Aside } from "#card/aside.ts";
import { carded, composed } from "#card/card.fixtures.tsx";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Aside", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(carded(<Aside>More</Aside>));

    expect(slotElement(container, "card", "aside").tagName).toBe("DIV");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "aside",
      }),
    ).toStrictEqual([]);
  });

  it("puts a control it holds in reach of a keyboard", () => {
    render(
      carded(
        <Aside>
          <button type="button">More</button>
        </Aside>,
      ),
    );

    expect(screen.getByRole("button", { name: "More" })).toBeDefined();
  });
});
