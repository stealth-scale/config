import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";
import { Title } from "#alert/title.ts";

describe("Title", () => {
  it("draws a span inside the root it needs above it", () => {
    const { container } = render(alerted(<Title>Payment failed</Title>));

    expect(slotElement(container, "alert", "title").tagName).toBe("SPAN");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "title",
      }),
    ).toStrictEqual([]);
  });

  it("puts no level in the outline for something that is gone a moment later", () => {
    render(alerted(<Title>Payment failed</Title>));

    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("takes the level a page needs where a notice stays on it", () => {
    render(alerted(<Title as="h2">Payment failed</Title>));

    expect(screen.getByRole("heading", { level: 2, name: "Payment failed" })).toBeDefined();
  });
});
