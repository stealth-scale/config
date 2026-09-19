import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Action } from "#toolbar/action.tsx";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

describe("Action", () => {
  it("draws a button inside the row it needs above it", () => {
    const { container } = render(ranged(<Action>Filter</Action>));

    expect(slotElement(container, "toolbar", "action").tagName).toBe("BUTTON");
  });

  it("takes the row's tab stop rather than one of its own", () => {
    render(ranged(<Action>Filter</Action>));

    expect(screen.getByRole("button").tabIndex).toBe(0);
  });

  it("keeps its words at every width where nothing says otherwise", () => {
    const { container } = render(ranged(<Action>Filter</Action>));

    expect(slotElement(container, "toolbar", "action").dataset["priority"]).toBe("primary");
  });

  it("gives way in the order the priority states", () => {
    const { container } = render(ranged(<Action priority="tertiary">Export</Action>));

    expect(slotElement(container, "toolbar", "action").dataset["priority"]).toBe("tertiary");
  });

  it("leaves one stop where a row holds several controls", () => {
    render(
      ranged(
        <>
          <Action>Filter</Action>
          <Action priority="secondary">Sort</Action>
        </>,
      ),
    );

    expect(screen.getAllByRole("button").filter((each) => each.tabIndex === 0)).toHaveLength(1);
  });
});
