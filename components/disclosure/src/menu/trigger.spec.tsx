import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, handled, listed } from "#menu/menu.fixtures.tsx";
import { Trigger } from "#menu/trigger.tsx";

describe("Trigger", () => {
  it("draws a button inside the root it needs above it", async () => {
    const { container } = await drawn(listed(<Trigger>Actions</Trigger>));

    expect(slotElement(container, "menu", "trigger").tagName).toBe("BUTTON");
  });

  it("says the control opens a menu", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: /Actions/u }).getAttribute("aria-haspopup")).toBe(
      "menu",
    );
  });

  it("says whether the rows are open", async () => {
    await drawn(composed());

    const control = screen.getByRole("button", { name: /Actions/u });

    expect(control.getAttribute("aria-expanded")).toBe("false");
    await pressed(control);

    expect(screen.getByRole("button", { name: /Actions/u }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });

  it("names the panel it opens", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("button", { name: /Actions/u }).getAttribute("aria-controls")).toBe(
      screen.getByRole("menu").id,
    );
  });

  it("names itself where a caller shares one menu between several controls", async () => {
    const { container } = await drawn(listed(<Trigger value="row-7">Actions</Trigger>));

    expect(slotElement(container, "menu", "trigger").dataset["value"]).toBe("row-7");
  });

  it("carries no value where a caller names none", async () => {
    const { container } = await drawn(listed(<Trigger>Actions</Trigger>));

    expect(slotElement(container, "menu", "trigger").dataset["value"]).toBeUndefined();
  });

  it("keeps a handler a caller hands it beside the machine's own", async () => {
    const heard = vi.fn<() => void>();

    await drawn(handled(heard));
    await pressed(screen.getByRole("button", { name: "Actions" }));

    expect(heard).toHaveBeenCalledOnce();
  });
});
