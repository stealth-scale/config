import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Input } from "#listbox/input.tsx";
import { offered } from "#listbox/listbox.fixtures.tsx";

describe("Input", () => {
  it("draws a field inside the root it needs above it", () => {
    const { container } = render(offered(<Input aria-label="Filter places" />));

    expect(slotElement(container, "listbox", "input").tagName).toBe("INPUT");
  });

  it("says it drives a listbox", () => {
    render(offered(<Input aria-label="Filter places" />));

    expect(screen.getByRole("textbox").getAttribute("aria-haspopup")).toBe("listbox");
  });

  it("names the list it drives", () => {
    render(offered(<Input aria-label="Filter places" />));

    expect(screen.getByRole("textbox").getAttribute("aria-controls")).toBeTruthy();
  });
});
