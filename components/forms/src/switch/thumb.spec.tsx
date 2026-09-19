import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed, pressed, thrown } from "#switch/switch.fixtures.tsx";
import { Thumb } from "#switch/thumb.tsx";

describe("Thumb", () => {
  it("draws a span inside the root it needs above it", () => {
    const { container } = render(thrown(<Thumb />));

    expect(slotElement(container, "switch", "thumb").tagName).toBe("SPAN");
  });

  it("keeps the knob out of the accessibility tree", () => {
    const { container } = render(thrown(<Thumb />));

    expect(slotElement(container, "switch", "thumb").getAttribute("aria-hidden")).toBe("true");
  });

  it("rests at the start of the track while the switch is off", () => {
    const { container } = render(composed());

    expect(slotElement(container, "switch", "thumb").dataset["state"]).toBe("unchecked");
  });

  it("reports the state it crossed to", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("switch"));

    expect(slotElement(container, "switch", "thumb").dataset["state"]).toBe("checked");
  });
});
