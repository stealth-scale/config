import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { Description } from "#alert/description.ts";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";

describe("Description", () => {
  it("draws a span inside the root it needs above it", () => {
    const { container } = render(alerted(<Description>The card was declined.</Description>));

    expect(slotElement(container, "alert", "description").tagName).toBe("SPAN");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "description",
      }),
    ).toStrictEqual([]);
  });

  it("reads the root's ink rather than the muted one", () => {
    expect(recipe.base?.["description"]).toMatchObject({ color: "inherit" });
  });

  it("holds paragraphs where a caller states the element that may", () => {
    const { container } = render(alerted(<Description as="div">Two lines.</Description>));

    expect(slotElement(container, "alert", "description").tagName).toBe("DIV");
  });
});
