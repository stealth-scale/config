import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Label } from "#listbox/label.tsx";
import { composed, offered } from "#listbox/listbox.fixtures.tsx";

describe("Label", () => {
  it("draws a span inside the root it needs above it", () => {
    const { container } = render(offered(<Label>Places</Label>));

    expect(slotElement(container, "listbox", "label").tagName).toBe("SPAN");
  });

  it("names the list a reader reaches", () => {
    const { container } = render(composed());

    expect(screen.getByRole("listbox").getAttribute("aria-labelledby")).toBe(
      slotElement(container, "listbox", "label").id,
    );
  });
});
