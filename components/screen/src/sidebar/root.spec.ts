import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#sidebar/recipe.ts";
import { type RootProps } from "#sidebar/root.tsx";
import { composed } from "#sidebar/sidebar.fixtures.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding a head and a block and a foot", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("draws a column", () => {
    const { container } = render(composed());

    expect(slotElement(container, "sidebar", "root").tagName).toBe("DIV");
  });

  it("leaves the one landmark it holds to the block of destinations drawing it", () => {
    render(composed());

    expect(screen.getAllByRole("navigation")).toHaveLength(1);
  });

  it("says nothing about collapsing where the shell says nothing", () => {
    const { container } = render(composed());

    expect(slotElement(container, "sidebar", "root").dataset["iconic"]).toBeUndefined();
  });

  it("carries the collapse the shell states", () => {
    const { container } = render(composed({ iconic: true }));

    expect(slotElement(container, "sidebar", "root").dataset["iconic"]).toBe("");
  });
});
