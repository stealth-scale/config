import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#card/card.fixtures.tsx";
import { recipe } from "#card/recipe.ts";
import { Root, type RootProps } from "#card/root.ts";

describe("Root", () => {
  it("conforms as an article", () => {
    expect(violations(Root, { as: true, children: true, element: "ARTICLE" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding every band", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("is reachable as an article named by its title", () => {
    render(composed());

    expect(screen.getByRole("article", { name: "Invoice 4821" })).toBeDefined();
  });

  it("draws the element as names", () => {
    const { container } = render(composed({ as: "div" }));

    expect(slotElement(container, "card", "root").tagName).toBe("DIV");
  });
});
