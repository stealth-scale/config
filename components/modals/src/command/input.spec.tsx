import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed, palette, typed } from "#command/command.fixtures.tsx";
import { Input } from "#command/input.tsx";

describe("Input", () => {
  it("draws a field inside the band the palette states", () => {
    const { container } = render(palette(<Input aria-label="Type a command" />));

    expect(slotElement(container, "command", "input").tagName).toBe("INPUT");
  });

  it("draws no mark where a caller hands none over", () => {
    const { container } = render(palette(<Input aria-label="Type a command" />));

    expect(container.querySelector("[data-part=indicator]")).toBeNull();
  });

  it("draws the mark a caller hands over", () => {
    const { container } = render(palette(<Input aria-label="Type a command" indicator="s" />));

    expect(slotElement(container, "command", "indicator").textContent).toBe("s");
  });

  it("keeps the mark out of the accessibility tree", () => {
    const { container } = render(palette(<Input aria-label="Type a command" indicator="s" />));

    expect(slotElement(container, "command", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("narrows the list to what was typed", async () => {
    render(composed());
    await typed(screen.getByRole("textbox"), "inv");

    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("finds an action by the words added to it", async () => {
    render(composed());
    await typed(screen.getByRole("textbox"), "add");

    expect(screen.getByRole("option", { name: /New document/u })).toBeTruthy();
  });

  it("folds case so a reader typing in lower case still finds a row", async () => {
    render(composed());
    await typed(screen.getByRole("textbox"), "REPORTS");

    expect(screen.getByRole("option", { name: "Reports" })).toBeTruthy();
  });

  it("draws what was typed", async () => {
    render(composed());
    await typed(screen.getByRole("textbox"), "inv");

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe("inv");
  });
});
