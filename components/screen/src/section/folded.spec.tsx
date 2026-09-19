import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Folded } from "#section/folded.ts";
import { blocked } from "#section/section.fixtures.tsx";

describe("Folded", () => {
  it("draws a button inside the block it needs above it", () => {
    const { container } = render(blocked(<Folded aria-label="More billing actions" />));

    expect(slotElement(container, "section", "folded").tagName).toBe("BUTTON");
  });

  it("says it submits nothing, so a control inside a form does not", () => {
    render(blocked(<Folded aria-label="More billing actions" />));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("takes the name a caller gives it", () => {
    render(blocked(<Folded aria-label="More billing actions" />));

    expect(screen.getByRole("button", { name: "More billing actions" })).toBeTruthy();
  });
});
