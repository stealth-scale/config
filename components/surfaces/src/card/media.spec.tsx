import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { carded, composed } from "#card/card.fixtures.tsx";
import { Media } from "#card/media.ts";
import { recipe } from "#card/recipe.ts";
import { type RootProps } from "#card/root.ts";

describe("Media", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(
      carded(
        <Media>
          <img alt="" src="/invoice.png" />
        </Media>,
      ),
    );

    expect(slotElement(container, "card", "media").tagName).toBe("DIV");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "media",
      }),
    ).toStrictEqual([]);
  });

  it("names nothing itself, leaving the alternative text with the picture", () => {
    const { container } = render(
      carded(
        <Media>
          <img alt="An invoice" src="/invoice.png" />
        </Media>,
      ),
    );
    const band = slotElement(container, "card", "media");

    expect(band.hasAttribute("aria-label")).toBe(false);
    expect(band.querySelector("img")?.getAttribute("alt")).toBe("An invoice");
  });
});
