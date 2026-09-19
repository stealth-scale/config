import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#switcher/switcher.fixtures.tsx";

describe("Content", () => {
  it("draws the panel the rows sit in", () => {
    const { container } = render(composed());

    expect(slotElement(container, "switcher", "content")).toBeTruthy();
  });

  it("is the menu a reader walks", () => {
    render(composed());

    expect(screen.getByRole("menu")).toBeTruthy();
  });
});
