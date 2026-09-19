import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#switcher/switcher.fixtures.tsx";

describe("Option", () => {
  it("draws a row for each thing the screen could switch to", () => {
    const { container } = render(composed());

    expect(slotElement(container, "switcher", "option")).toBeTruthy();
  });

  it("says which row is the one the screen is showing", () => {
    render(composed());

    expect(screen.getByRole("menuitemradio", { checked: true, name: "Acme" })).toBeTruthy();
  });

  it("says the rest are not", () => {
    render(composed());

    expect(screen.getByRole("menuitemradio", { checked: false, name: "Globex" })).toBeTruthy();
  });
});
