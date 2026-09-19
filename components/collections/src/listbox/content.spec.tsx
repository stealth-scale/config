import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#listbox/content.tsx";
import { composed, offered } from "#listbox/listbox.fixtures.tsx";

describe("Content", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(offered(<Content />));

    expect(slotElement(container, "listbox", "content").tagName).toBe("DIV");
  });

  it("carries the listbox role rather than the frame around it", () => {
    render(offered(<Content />));

    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  it("takes the tab stop, so focus rests here while the highlight moves", () => {
    render(offered(<Content />));

    expect(screen.getByRole("listbox").getAttribute("tabindex")).toBe("0");
  });

  it("points at the row a reader is on", () => {
    render(composed({ defaultHighlightedValue: "reports" }));

    expect(screen.getByRole("listbox").getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Reports" }).id,
    );
  });
});
