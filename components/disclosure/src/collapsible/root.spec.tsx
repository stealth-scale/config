import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, pressed } from "#collapsible/collapsible.fixtures.tsx";
import { recipe } from "#collapsible/recipe.ts";
import { Root, type RootProps } from "#collapsible/root.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding a trigger and a block", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("carries no role because the trigger and the block carry their own meaning", () => {
    const { container } = render(composed());

    expect(slotElement(container, "collapsible", "root").hasAttribute("role")).toBe(false);
  });

  it("draws the element as names", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "collapsible", "root").tagName).toBe("SECTION");
  });

  it("starts closed until a caller says otherwise", () => {
    render(composed());

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });

  it("starts open where a caller says so", () => {
    render(composed({ defaultOpen: true }));

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("opens when the control is pressed", async () => {
    render(composed());
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("tells a caller each time it opens and closes", async () => {
    const told = vi.fn<(details: { readonly open: boolean }) => void>();

    render(composed({ onOpenChange: told }));
    await pressed(screen.getByRole("button"));

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ open: true }));
  });

  it("follows a caller that drives it", async () => {
    render(composed({ open: true }));
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("stays shut where a caller disables it", async () => {
    render(composed({ disabled: true }));
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });

  it("builds the reference between the control and the block from the id a caller names", () => {
    render(composed({ id: "details" }));

    const named = screen.getByRole("button").getAttribute("aria-controls");

    expect(named).toBeTruthy();
    expect(named).toContain("details");
  });

  it("generates an id where a caller names none", () => {
    render(<Root />);
    render(<Root />);

    expect(document.querySelectorAll("[data-scope=collapsible][data-part=root]")).toHaveLength(2);
  });
});
