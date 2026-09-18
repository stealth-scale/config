import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, opened } from "#popover/popover.fixtures.tsx";
import { Trigger } from "#popover/trigger.tsx";

describe("Trigger", () => {
  it("draws a button inside the root it needs above it", () => {
    const { container } = render(opened(<Trigger>Filters</Trigger>));

    expect(slotElement(container, "popover", "trigger").tagName).toBe("BUTTON");
  });

  it("says whether the panel is open", async () => {
    render(composed());

    const control = screen.getByRole("button", { name: /Filters/u });

    expect(control.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(control);
    await settled();

    expect(screen.getByRole("button", { name: /Filters/u }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("names the panel it controls", () => {
    render(composed({ defaultOpen: true }));

    expect(screen.getByRole("button", { name: /Filters/u }).getAttribute("aria-controls")).toBe(
      screen.getByRole("dialog").id,
    );
  });

  it("keeps a handler a caller hands it beside the machine's own", async () => {
    const heard = vi.fn<() => void>();

    render(opened(<Trigger onClick={heard}>Filters</Trigger>));
    fireEvent.click(screen.getByRole("button"));
    await settled();

    expect(heard).toHaveBeenCalledOnce();
  });
});
