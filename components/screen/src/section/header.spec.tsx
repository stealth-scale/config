import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Header } from "#section/header.ts";
import { blocked } from "#section/section.fixtures.tsx";

describe("Header", () => {
  it("draws a header inside the block it needs above it", () => {
    const { container } = render(blocked(<Header>Billing</Header>));

    expect(slotElement(container, "section", "header").tagName).toBe("HEADER");
  });

  it("places its parts on a grid rather than nesting them", () => {
    const { container } = render(blocked(<Header>Billing</Header>));

    expect(slotElement(container, "section", "header").children).toHaveLength(0);
  });
});
