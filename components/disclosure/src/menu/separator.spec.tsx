import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, listed } from "#menu/menu.fixtures.tsx";
import { Separator } from "#menu/separator.tsx";

describe("Separator", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(listed(<Separator />));

    expect(slotElement(container, "menu", "separator").tagName).toBe("DIV");
  });

  it("carries the separator role so a screen reader reports the break", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("says it runs across the rows rather than between them", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(listed(<Separator as="hr" />));

    expect(slotElement(container, "menu", "separator").tagName).toBe("HR");
  });
});
