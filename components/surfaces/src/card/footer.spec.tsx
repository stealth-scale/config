import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { Footer } from "#card/footer.ts";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Footer", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(carded(<Footer>Send</Footer>));

    expect(slotElement(container, "card", "footer").tagName).toBe("DIV");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "footer",
      }),
    ).toStrictEqual([]);
  });

  it("takes the spread the root states rather than one of its own", () => {
    const { container } = render(composed({ justify: "between" }));

    expect([...slotElement(container, "card", "footer").classList]).toContain(
      variantClass("card__footer", "justify", "between"),
    );
  });
});
