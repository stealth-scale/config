import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Item } from "#roving-focus/item.tsx";
import { recipe } from "#roving-focus/recipe.ts";
import { Root } from "#roving-focus/root.tsx";

describe("Root", () => {
  it("breaks no accessibility rule as a toolbar holding a button", async () => {
    await expect(
      accessibilityViolations(Root, {
        props: { children: <Item as="button">Cut</Item>, role: "toolbar" },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props} />).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it("tells a screen reader which way a group with a role runs", () => {
    const { container } = render(<Root orientation="vertical" role="toolbar" />);

    expect(slotElement(container, "roving-focus", "root").getAttribute("aria-orientation")).toBe(
      "vertical",
    );
  });

  it("tells a screen reader nothing about a group with no role", () => {
    const { container } = render(<Root orientation="vertical" />);

    expect(
      slotElement(container, "roving-focus", "root").getAttribute("aria-orientation"),
    ).toBeNull();
  });

  it("tells a screen reader nothing where the arrows move on both axes", () => {
    const { container } = render(<Root orientation="both" role="toolbar" />);

    expect(
      slotElement(container, "roving-focus", "root").getAttribute("aria-orientation"),
    ).toBeNull();
  });

  it("draws the element as names", () => {
    const { container } = render(<Root as="nav" />);

    expect(slotElement(container, "roving-focus", "root").tagName).toBe("NAV");
  });
});
