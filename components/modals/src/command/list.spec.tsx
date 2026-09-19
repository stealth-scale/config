import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed, palette } from "#command/command.fixtures.tsx";
import { List } from "#command/list.tsx";

describe("List", () => {
  it("draws a scroller inside the panel it needs above it", () => {
    const { container } = render(palette(<List />));

    expect(slotElement(container, "command", "list").tagName).toBe("DIV");
  });

  it("names the list from what the palette is for", () => {
    render(composed());

    expect(screen.getByRole("listbox", { name: "Commands" })).toBeTruthy();
  });

  it("gathers the actions under the headings they name", () => {
    render(composed());

    expect(screen.getByRole("group", { name: "Go to" })).toBeTruthy();
  });

  it("draws no heading over the actions that name none", () => {
    render(composed());

    expect(screen.getAllByRole("group")).toHaveLength(2);
  });

  it("names a group by its position rather than by its heading", () => {
    const { container } = render(composed());

    expect(container.querySelector("[role=group]")?.id).toMatch(/group-0/u);
  });

  it("draws the keystroke of an action that carries one", () => {
    const { container } = render(composed());

    expect(slotElement(container, "command", "shortcut").textContent).toBe("N");
  });
});
