import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, handled, opened } from "#popover/popover.fixtures.tsx";
import { Trigger } from "#popover/trigger.tsx";

describe("Trigger", () => {
  it("draws a button inside the root it needs above it", async () => {
    const { container } = await drawn(opened(<Trigger>Filters</Trigger>));

    expect(slotElement(container, "popover", "trigger").tagName).toBe("BUTTON");
  });

  it("says whether the panel is open", async () => {
    await drawn(composed());

    const control = screen.getByRole("button", { name: /Filters/u });

    expect(control.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(control);
    await settled();

    expect(screen.getByRole("button", { name: /Filters/u }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("names the panel it controls", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("button", { name: /Filters/u }).getAttribute("aria-controls")).toBe(
      screen.getByRole("dialog").id,
    );
  });

  it("keeps a handler a caller hands it beside the machine's own", async () => {
    const heard = vi.fn<() => void>();

    await drawn(handled(heard));
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    await settled();

    expect(heard).toHaveBeenCalledOnce();
  });
});
