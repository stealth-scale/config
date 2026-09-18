import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, settled } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#popover/popover.fixtures.tsx";
import { recipe } from "#popover/recipe.ts";
import { type RootProps } from "#popover/root.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding a control and its panel", async () => {
    await expect(
      accessibilityViolations(() => composed({ defaultOpen: true })),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("keeps the panel shut until the control is pressed", () => {
    render(composed());

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens the panel when the control is pressed", async () => {
    render(composed());
    fireEvent.click(screen.getByRole("button", { name: /Filters/u }));
    await settled();

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("opens the panel where a caller says it starts open", () => {
    render(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("tells a caller each time the panel opens and shuts", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    render(composed({ onOpenChange: told }));
    fireEvent.click(screen.getByRole("button", { name: /Filters/u }));
    await settled();

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ open: true }));
  });

  it("follows a caller that drives it", async () => {
    render(composed({ open: true }));
    fireEvent.click(screen.getByRole("button", { name: /Filters/u }));
    await settled();

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("takes part in no layout of its own", () => {
    const { container } = render(composed());

    expect(slotElement(container, "popover", "root").tagName).toBe("DIV");
  });
});
