import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Separator } from "#sidebar/separator.ts";
import { aside } from "#sidebar/sidebar.fixtures.tsx";

describe("Separator", () => {
  it("draws a rule inside the column it needs above it", () => {
    const { container } = render(aside(<Separator />));

    expect(slotElement(container, "sidebar", "separator").tagName).toBe("HR");
  });

  it("parts one block of destinations from the next for a screen reader", () => {
    render(aside(<Separator />));

    expect(screen.getByRole("separator")).toBeTruthy();
  });

  it("leaves the tree where a caller draws one purely for rhythm", () => {
    render(aside(<Separator aria-hidden />));

    expect(screen.queryByRole("separator")).toBeNull();
  });
});
