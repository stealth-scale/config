import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { Content } from "#alert/content.ts";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";

describe("Content", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(alerted(<Content>a word</Content>));

    expect(slotElement(container, "alert", "content").tagName).toBe("DIV");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "content",
      }),
    ).toStrictEqual([]);
  });

  it("carries no role because the band groups nothing a reader navigates by", () => {
    const { container } = render(alerted(<Content>a word</Content>));

    expect(slotElement(container, "alert", "content").hasAttribute("role")).toBe(false);
  });
});
