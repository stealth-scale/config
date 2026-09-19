import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { bodied, narrowed, tablet } from "#app-shell/app-shell.fixtures.tsx";
import { Navbar } from "#app-shell/navbar.tsx";

describe("Navbar", () => {
  it("draws a track inside the body it needs above it", () => {
    const { container } = render(bodied(<Navbar />));

    expect(slotElement(container, "app-shell", "navbar").tagName).toBe("DIV");
  });

  it("claims no landmark, leaving that to what it holds", () => {
    render(
      bodied(
        <Navbar>
          <nav aria-label="Workspace" />
        </Navbar>,
      ),
    );

    expect(screen.getAllByRole("navigation")).toHaveLength(1);
  });

  it("sits beside the page while the shell is wide enough for it", () => {
    const { container } = render(bodied(<Navbar />));

    expect(slotElement(container, "app-shell", "navbar").dataset["overlaid"]).toBeUndefined();
  });

  it("leaves the body once the shell is too narrow to hold it beside the page", () => {
    const { container } = render(narrowed(bodied(<Navbar />)));

    expect(slotElement(container, "app-shell", "navbar").dataset["overlaid"]).toBe("");
  });

  it("drops under the page rather than over it where it is told to", () => {
    const { container } = render(narrowed(bodied(<Navbar folds="under" />)));

    expect(slotElement(container, "app-shell", "navbar").dataset["stacked"]).toBe("");
  });

  it("folds at the width a caller states rather than at its own", () => {
    const { container } = render(tablet(bodied(<Navbar foldsBelow="lg" />)));

    expect(slotElement(container, "app-shell", "navbar").dataset["overlaid"]).toBe("");
  });

  it("holds beside the page at a width its own fold has not reached", () => {
    const { container } = render(tablet(bodied(<Navbar />)));

    expect(slotElement(container, "app-shell", "navbar").dataset["overlaid"]).toBeUndefined();
  });
});
