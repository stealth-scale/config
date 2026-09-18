import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, hinted } from "#tooltip/tooltip.fixtures.tsx";
import { Trigger } from "#tooltip/trigger.tsx";

describe("Trigger", () => {
  it("draws a button inside the root it needs above it", () => {
    const { container } = render(hinted(<Trigger>Save</Trigger>));

    expect(slotElement(container, "tooltip", "trigger").tagName).toBe("BUTTON");
  });

  it("points at the box so a screen reader reads it as a description", async () => {
    render(composed({ defaultOpen: true }));
    await settled();

    expect(screen.getByRole("button").getAttribute("aria-describedby")).toBe(
      screen.getByRole("tooltip").id,
    );
  });

  it("keeps a handler a caller hands it beside the machine's own", async () => {
    const heard = vi.fn<() => void>();

    render(hinted(<Trigger onFocus={heard}>Save</Trigger>));
    fireEvent.focus(screen.getByRole("button"));
    await settled();

    expect(heard).toHaveBeenCalledOnce();
  });

  it("draws the element as names for a control that is not a button", () => {
    const { container } = render(hinted(<Trigger as="a">Read on</Trigger>));

    expect(slotElement(container, "tooltip", "trigger").tagName).toBe("A");
  });
});
