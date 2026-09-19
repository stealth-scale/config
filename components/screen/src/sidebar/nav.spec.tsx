import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { NavLabel } from "#sidebar/nav-label.tsx";
import { Nav } from "#sidebar/nav.tsx";
import { aside } from "#sidebar/sidebar.fixtures.tsx";

describe("Nav", () => {
  it("draws a navigation inside the column it needs above it", () => {
    const { container } = render(aside(<Nav />));

    expect(slotElement(container, "sidebar", "nav").tagName).toBe("NAV");
  });

  it("names itself from its own heading", () => {
    render(
      aside(
        <Nav>
          <NavLabel>Workspace</NavLabel>
        </Nav>,
      ),
    );

    expect(screen.getByRole("navigation", { name: "Workspace" })).toBeTruthy();
  });

  it("carries no name where no heading is drawn", () => {
    render(aside(<Nav />));

    expect(screen.queryByRole("navigation", { name: /./u })).toBeNull();
  });

  it("takes the name a caller states over the one it derives", () => {
    render(aside(<Nav aria-label="Account" />));

    expect(screen.getByRole("navigation", { name: "Account" })).toBeTruthy();
  });

  it("names two blocks apart", () => {
    render(
      aside(
        <>
          <Nav>
            <NavLabel>Workspace</NavLabel>
          </Nav>
          <Nav>
            <NavLabel>Account</NavLabel>
          </Nav>
        </>,
      ),
    );

    expect(
      screen.getAllByRole("navigation").map((each) => each.getAttribute("aria-labelledby")),
    ).toHaveLength(2);
    expect(screen.getByRole("navigation", { name: "Account" })).toBeTruthy();
  });
});
