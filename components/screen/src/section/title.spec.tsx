import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { blocked } from "#section/section.fixtures.tsx";
import { Title } from "#section/title.tsx";

describe("Title", () => {
  it("draws a second-level heading inside the block it needs above it", () => {
    const { container } = render(blocked(<Title>Billing</Title>));

    expect(slotElement(container, "section", "title").tagName).toBe("H2");
  });

  it("is a heading a screen reader can jump to", () => {
    render(blocked(<Title>Billing</Title>));

    expect(screen.getByRole("heading", { level: 2, name: "Billing" })).toBeTruthy();
  });

  it("draws the level a nested section needs", () => {
    render(blocked(<Title as="h3">Billing</Title>));

    expect(screen.getByRole("heading", { level: 3 })).toBeTruthy();
  });
});
