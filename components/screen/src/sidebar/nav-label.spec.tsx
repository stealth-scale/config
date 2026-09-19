import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { NavLabel } from "#sidebar/nav-label.tsx";
import { blocked } from "#sidebar/sidebar.fixtures.tsx";

describe("NavLabel", () => {
  it("draws a second-level heading inside the block it needs above it", () => {
    const { container } = render(blocked(<NavLabel>Workspace</NavLabel>));

    expect(slotElement(container, "sidebar", "navLabel").tagName).toBe("H2");
  });

  it("is a heading a screen reader can jump to", () => {
    render(blocked(<NavLabel>Workspace</NavLabel>));

    expect(screen.getByRole("heading", { level: 2, name: "Workspace" })).toBeTruthy();
  });

  it("carries the identifier the block points at", () => {
    const { container } = render(blocked(<NavLabel>Workspace</NavLabel>));

    expect(slotElement(container, "sidebar", "navLabel").id).toBe(
      slotElement(container, "sidebar", "nav").getAttribute("aria-labelledby"),
    );
  });

  it("draws the level a sidebar under a named region needs", () => {
    render(blocked(<NavLabel as="h3">Workspace</NavLabel>));

    expect(screen.getByRole("heading", { level: 3 })).toBeTruthy();
  });

  it("throws where no block stands above it", () => {
    expect(() => render(<NavLabel>Workspace</NavLabel>)).toThrow(/Sidebar\.Nav/u);
  });
});
