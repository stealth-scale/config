import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, settled } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#tabs/recipe.ts";
import { type RootProps } from "#tabs/root.tsx";
import { composed } from "#tabs/tabs.fixtures.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding a strip and its panels", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("carries no role because the strip and the panels carry their own", () => {
    const { container } = render(composed());

    expect(slotElement(container, "tabs", "root").hasAttribute("role")).toBe(false);
  });

  it("shows the panel a caller starts it on", () => {
    render(composed());

    expect(screen.getByRole("tab", { name: "First" }).getAttribute("aria-selected")).toBe("true");
  });

  it("shows another panel when its control is pressed", async () => {
    render(composed());
    fireEvent.click(screen.getByRole("tab", { name: "Second" }));
    await settled();

    expect(screen.getByRole("tab", { name: "Second" }).getAttribute("aria-selected")).toBe("true");
  });

  it("tells a caller each time the panel changes", async () => {
    const told = vi.fn<(details: { readonly value: null | string }) => void>();

    render(composed({ onValueChange: told }));
    fireEvent.click(screen.getByRole("tab", { name: "Second" }));
    await settled();

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ value: "second" }));
  });

  it("follows a caller that drives it", async () => {
    render(composed({ value: "second" }));
    fireEvent.click(screen.getByRole("tab", { name: "First" }));
    await settled();

    expect(screen.getByRole("tab", { name: "Second" }).getAttribute("aria-selected")).toBe("true");
  });

  it("passes over a control a caller disabled", async () => {
    render(composed());
    fireEvent.click(screen.getByRole("tab", { name: "Third" }));
    await settled();

    expect(screen.getByRole("tab", { name: "Third" }).getAttribute("aria-selected")).toBe("false");
  });

  it("says which way the set runs", () => {
    const { container } = render(composed({ orientation: "vertical" }));

    expect(slotElement(container, "tabs", "root").dataset["orientation"]).toBe("vertical");
  });

  it("draws the element as names", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "tabs", "root").tagName).toBe("SECTION");
  });
});
