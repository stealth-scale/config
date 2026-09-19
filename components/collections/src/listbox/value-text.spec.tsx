import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { offered } from "#listbox/listbox.fixtures.tsx";
import { ValueText } from "#listbox/value-text.tsx";

describe("ValueText", () => {
  it("draws a span inside the root it needs above it", () => {
    const { container } = render(offered(<ValueText />));

    expect(slotElement(container, "listbox", "valueText").tagName).toBe("SPAN");
  });

  it("draws the placeholder while nothing is chosen", () => {
    render(offered(<ValueText placeholder="Nothing chosen" />));

    expect(screen.getByText("Nothing chosen")).toBeTruthy();
  });

  it("reports the words of the row that is chosen", () => {
    render(offered(<ValueText placeholder="Nothing chosen" />, { value: ["reports"] }));

    expect(screen.getByText("Reports")).toBeTruthy();
  });

  it("draws what a caller puts inside it over both", () => {
    render(offered(<ValueText placeholder="Nothing chosen">Three places</ValueText>));

    expect(screen.getByText("Three places")).toBeTruthy();
  });
});
