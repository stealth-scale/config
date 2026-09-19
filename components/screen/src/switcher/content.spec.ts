import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#switcher/switcher.fixtures.tsx";

describe("Content", () => {
  it("draws the panel the rows sit in", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "switcher", "content")).toBeTruthy();
  });

  it("is the menu a reader walks", async () => {
    await drawn(composed());

    expect(screen.getByRole("menu")).toBeTruthy();
  });
});
