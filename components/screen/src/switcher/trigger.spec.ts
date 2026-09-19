import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#switcher/recipe.ts";
import { type RootProps } from "#switcher/root.ts";
import { composed } from "#switcher/switcher.fixtures.tsx";

describe("Trigger", () => {
  it("breaks no accessibility rule holding a control and its list", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("draws a control a reader presses", () => {
    const { container } = render(composed());

    expect(slotElement(container, "switcher", "root").tagName).toBe("BUTTON");
  });

  it("says what it switches before what it is switched to", () => {
    render(composed());

    expect(screen.getByRole("button", { name: "Workspace Acme Pro plan" })).toBeTruthy();
  });

  it("keeps the words a reader sees in the name a reader hears", () => {
    render(composed());

    expect(screen.getByRole("button").getAttribute("aria-label")).toBeNull();
  });

  it("says there is a list behind it", () => {
    render(composed());

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });
});
