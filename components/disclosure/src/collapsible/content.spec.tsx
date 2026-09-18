import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed, disclosed, pressed } from "#collapsible/collapsible.fixtures.tsx";
import { Content } from "#collapsible/content.tsx";

describe("Content", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(disclosed(<Content>The block</Content>));

    expect(slotElement(container, "collapsible", "content").tagName).toBe("DIV");
  });

  it("is hidden while the block is closed", () => {
    const { container } = render(composed());

    expect(slotElement(container, "collapsible", "content").hasAttribute("hidden")).toBe(true);
  });

  it("is shown once the control is pressed", async () => {
    const { container } = render(composed());

    await pressed(screen.getByRole("button"));

    expect(slotElement(container, "collapsible", "content").hasAttribute("hidden")).toBe(false);
  });

  it("carries no state on the first render of a block that starts open", () => {
    const { container } = render(composed({ defaultOpen: true }));

    expect(slotElement(container, "collapsible", "content").dataset["state"]).toBeUndefined();
  });

  it("carries the state the recipe styles the closed block by", () => {
    const { container } = render(composed());

    expect(slotElement(container, "collapsible", "content").dataset["state"]).toBe("closed");
  });

  it("is named by the machine so the control can point at it", () => {
    const { container } = render(composed());

    expect(slotElement(container, "collapsible", "content").id).toBe(
      screen.getByRole("button").getAttribute("aria-controls"),
    );
  });

  it("draws the element as names", () => {
    const { container } = render(disclosed(<Content as="section">The block</Content>));

    expect(slotElement(container, "collapsible", "content").tagName).toBe("SECTION");
  });

  it("throws where it is drawn outside the root that holds it together", () => {
    const quiet = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Content>The block</Content>)).toThrow(
      "A part of Collapsible was drawn outside the root that holds it together.",
    );

    quiet.mockRestore();
  });
});
