import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Control } from "#switch/control.tsx";
import { composed, pressed, thrown } from "#switch/switch.fixtures.tsx";

describe("Control", () => {
  it("draws a span inside the root it needs above it", () => {
    const { container } = render(thrown(<Control />));

    expect(slotElement(container, "switch", "control").tagName).toBe("SPAN");
  });

  it("keeps the track out of the accessibility tree", () => {
    const { container } = render(thrown(<Control />));

    expect(slotElement(container, "switch", "control").getAttribute("aria-hidden")).toBe("true");
  });

  it("reports the state the machine is in", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("switch"));

    expect(slotElement(container, "switch", "control").dataset["state"]).toBe("checked");
  });

  it("reports a switch the field around it marks wrong", () => {
    const { container } = render(composed({ invalid: true }));

    expect(slotElement(container, "switch", "control").dataset["invalid"]).toBe("");
  });
});
