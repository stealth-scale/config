import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { disclosed, pressed } from "#collapsible/collapsible.fixtures.tsx";
import { Trigger } from "#collapsible/trigger.tsx";

describe("Trigger", () => {
  it("draws a button inside the root it needs above it", () => {
    const { container } = render(disclosed(<Trigger>Details</Trigger>));

    expect(slotElement(container, "collapsible", "trigger").tagName).toBe("BUTTON");
  });

  it("says whether the block is expanded", () => {
    render(disclosed(<Trigger>Details</Trigger>));

    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
  });

  it("names the block it controls", () => {
    render(disclosed(<Trigger>Details</Trigger>));

    expect(screen.getByRole("button").getAttribute("aria-controls")).toBeTruthy();
  });

  it("keeps a handler a caller hands it beside the machine's own", async () => {
    const heard = vi.fn<() => void>();

    render(disclosed(<Trigger onClick={heard}>Details</Trigger>));
    await pressed(screen.getByRole("button"));

    expect(heard).toHaveBeenCalledOnce();
    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
  });

  it("throws where it is drawn outside the root that holds it together", () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Trigger>Details</Trigger>)).toThrow(
      "A part of Collapsible was drawn outside the root that holds it together.",
    );

    quiet.mockRestore();
  });
});
