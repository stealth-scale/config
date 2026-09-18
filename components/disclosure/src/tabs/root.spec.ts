import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#tabs/recipe.ts";
import { type RootProps } from "#tabs/root.tsx";
import { composed } from "#tabs/tabs.fixtures.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding a strip and its panels", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("carries no role because the strip and the panels carry their own", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "tabs", "root").hasAttribute("role")).toBe(false);
  });

  it("shows the panel a caller starts it on", async () => {
    await drawn(composed());

    expect(screen.getByRole("tab", { name: "First" }).getAttribute("aria-selected")).toBe("true");
  });

  it("shows another panel when its control is pressed", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByRole("tab", { name: "Second" }));
    await settled();

    expect(screen.getByRole("tab", { name: "Second" }).getAttribute("aria-selected")).toBe("true");
  });

  it("tells a caller each time the panel changes", async () => {
    const told = vi.fn<(details: { readonly value: null | string }) => void>();

    await drawn(composed({ onValueChange: told }));
    fireEvent.click(screen.getByRole("tab", { name: "Second" }));
    await settled();

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ value: "second" }));
  });

  it("follows a caller that drives it", async () => {
    await drawn(composed({ value: "second" }));
    fireEvent.click(screen.getByRole("tab", { name: "First" }));
    await settled();

    expect(screen.getByRole("tab", { name: "Second" }).getAttribute("aria-selected")).toBe("true");
  });

  it("passes over a control a caller disabled", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByRole("tab", { name: "Third" }));
    await settled();

    expect(screen.getByRole("tab", { name: "Third" }).getAttribute("aria-selected")).toBe("false");
  });

  it("says which way the set runs", async () => {
    const { container } = await drawn(composed({ orientation: "vertical" }));

    expect(slotElement(container, "tabs", "root").dataset["orientation"]).toBe("vertical");
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(composed({ as: "section" }));

    expect(slotElement(container, "tabs", "root").tagName).toBe("SECTION");
  });
});
