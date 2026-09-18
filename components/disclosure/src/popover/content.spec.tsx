import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#popover/content.tsx";
import { composed, opened } from "#popover/popover.fixtures.tsx";

describe("Content", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(opened(<Content />));

    expect(slotElement(container, "popover", "content").tagName).toBe("DIV");
  });

  it("carries the dialog role so a screen reader knows what opened", () => {
    render(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("is announced by the heading inside it", () => {
    render(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog").getAttribute("aria-labelledby")).toBe(
      screen.getByRole("heading", { name: "Filter the list" }).id,
    );
  });

  it("is described by the paragraph inside it", () => {
    const { container } = render(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog").getAttribute("aria-describedby")).toBe(
      slotElement(container, "popover", "description").id,
    );
  });

  it("draws the element as names", () => {
    const { container } = render(opened(<Content as="section" />));

    expect(slotElement(container, "popover", "content").tagName).toBe("SECTION");
  });
});
