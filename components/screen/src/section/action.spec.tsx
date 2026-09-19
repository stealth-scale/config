import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Action } from "#section/action.tsx";
import { blocked } from "#section/section.fixtures.tsx";

describe("Action", () => {
  it("draws a button inside the block it needs above it", () => {
    const { container } = render(blocked(<Action>Change plan</Action>));

    expect(slotElement(container, "section", "action").tagName).toBe("BUTTON");
  });

  it("says it submits nothing, so a control inside a form does not", () => {
    render(blocked(<Action>Change plan</Action>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("keeps its words at every width where nothing says otherwise", () => {
    const { container } = render(blocked(<Action>Change plan</Action>));

    expect(slotElement(container, "section", "action").dataset["priority"]).toBe("primary");
  });

  it("gives way in the order the priority states", () => {
    const { container } = render(blocked(<Action priority="tertiary">Archive</Action>));

    expect(slotElement(container, "section", "action").dataset["priority"]).toBe("tertiary");
  });
});
