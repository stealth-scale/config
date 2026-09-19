import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { paged } from "#page/page.fixtures.tsx";
import { Title } from "#page/title.ts";

describe("Title", () => {
  it("draws a first-level heading inside the column it needs above it", () => {
    const { container } = render(paged(<Title>April</Title>));

    expect(slotElement(container, "page", "title").tagName).toBe("H1");
  });

  it("is the heading a reader jumping by heading lands on first", () => {
    render(paged(<Title>April</Title>));

    expect(screen.getByRole("heading", { level: 1, name: "April" })).toBeTruthy();
  });

  it("draws the level a screen holding two pages needs", () => {
    render(paged(<Title as="h2">April</Title>));

    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });
});
