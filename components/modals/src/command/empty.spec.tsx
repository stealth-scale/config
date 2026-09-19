import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed, palette, typed } from "#command/command.fixtures.tsx";
import { Empty } from "#command/empty.ts";

describe("Empty", () => {
  it("draws a paragraph inside the panel it needs above it", () => {
    const { container } = render(palette(<Empty>No commands match</Empty>));

    expect(slotElement(container, "command", "empty").tagName).toBe("P");
  });

  it("stays out of the document while something matches", () => {
    render(composed());

    expect(screen.queryByText("No commands match")).toBeNull();
  });

  it("stands where nothing matches what was typed", async () => {
    render(composed());
    await typed(screen.getByRole("textbox"), "zzz");

    expect(screen.getByText("No commands match")).toBeTruthy();
  });

  it("leaves no rows behind it where nothing matches", async () => {
    render(composed());
    await typed(screen.getByRole("textbox"), "zzz");

    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });
});
