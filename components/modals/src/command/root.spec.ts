import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, pressed } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#command/command.fixtures.tsx";
import { recipe } from "#command/recipe.ts";
import { type RootProps } from "#command/root.tsx";

/**
 * Describes what a case sets on the panel, less what the fixture already states.
 */
type Settings = Omit<RootProps, "actions" | "aria-label">;

describe("Root", () => {
  it("breaks no accessibility rule holding a field and a list", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: Settings) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("draws a panel", () => {
    const { container } = render(composed());

    expect(slotElement(container, "command", "root").tagName).toBe("DIV");
  });

  it("names the list from what the palette is for", () => {
    render(composed());

    expect(screen.getByRole("listbox", { name: "Commands" })).toBeTruthy();
  });

  it("lists every action before anything is typed", () => {
    render(composed());

    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("hands back the value of the action that was run", async () => {
    const heard = vi.fn<(value: string) => void>();

    render(composed({ onRun: heard }));
    await pressed(screen.getByRole("option", { name: "Invoices" }));

    expect(heard).toHaveBeenCalledWith("invoices");
  });

  it("leaves nothing marked once an action has been run", async () => {
    render(composed());
    await pressed(screen.getByRole("option", { name: "Invoices" }));

    expect(screen.getByRole("option", { name: "Invoices" }).getAttribute("aria-selected")).toBe(
      "false",
    );
  });
});
