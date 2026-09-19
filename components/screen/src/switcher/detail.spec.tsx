import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Detail } from "#switcher/detail.ts";
import { held } from "#switcher/parts.fixtures.tsx";

describe("Detail", () => {
  it("draws a span inside the control it needs above it", () => {
    const { container } = render(held(<Detail>Pro plan</Detail>));

    expect(slotElement(container, "switcher", "detail").tagName).toBe("SPAN");
  });

  it("is read out, being what tells two things of one name apart", () => {
    render(held(<Detail>Pro plan</Detail>));

    expect(screen.getByRole("button", { name: "Workspace Pro plan" })).toBeTruthy();
  });
});
