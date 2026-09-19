import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Label } from "#switch/label.tsx";
import { composed, thrown } from "#switch/switch.fixtures.tsx";

describe("Label", () => {
  it("draws a span inside the root it needs above it", () => {
    const { container } = render(thrown(<Label>Dark mode</Label>));

    expect(slotElement(container, "switch", "label").tagName).toBe("SPAN");
  });

  it("names the control the root draws", () => {
    const { container } = render(composed());

    expect(screen.getByRole("switch").getAttribute("aria-labelledby")).toBe(
      slotElement(container, "switch", "label").id,
    );
  });

  it("reports the state the machine is in", () => {
    const { container } = render(composed({ defaultChecked: true }));

    expect(slotElement(container, "switch", "label").dataset["state"]).toBe("checked");
  });
});
