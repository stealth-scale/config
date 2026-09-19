import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Folded } from "#toolbar/folded.ts";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

describe("Folded", () => {
  it("draws a button inside the row it needs above it", () => {
    const { container } = render(ranged(<Folded aria-label="More actions" />));

    expect(slotElement(container, "toolbar", "folded").tagName).toBe("BUTTON");
  });

  it("takes the row's tab stop rather than one of its own", () => {
    render(ranged(<Folded aria-label="More actions" />));

    expect(screen.getByRole("button").tabIndex).toBe(0);
  });

  it("takes the name a caller gives it", () => {
    render(ranged(<Folded aria-label="More invoice actions" />));

    expect(screen.getByRole("button", { name: "More invoice actions" })).toBeTruthy();
  });
});
