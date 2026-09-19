import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Separator } from "#toolbar/separator.ts";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

describe("Separator", () => {
  it("draws the rule inside the row it needs above it", () => {
    const { container } = render(ranged(<Separator />));

    expect(slotElement(container, "toolbar", "separator")).toBeTruthy();
  });

  it("keeps the separator role, one set of controls being parted from the next", () => {
    render(ranged(<Separator />));

    expect(screen.getByRole("separator")).toBeTruthy();
  });

  it("says nothing where a caller draws one for rhythm alone", () => {
    render(ranged(<Separator aria-hidden />));

    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("runs down the row rather than across it", () => {
    const { container } = render(ranged(<Separator />));

    expect(slotElement(container, "toolbar", "separator").getAttribute("aria-orientation")).toBe(
      "vertical",
    );
  });

  it("draws the rule on its end rather than a line stretched to the row's height", () => {
    const { container } = render(ranged(<Separator />));

    expect(slotElement(container, "toolbar", "separator").className).toContain("divider--vertical");
  });
});
