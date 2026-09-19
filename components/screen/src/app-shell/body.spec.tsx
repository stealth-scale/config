import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, narrowed, shell } from "#app-shell/app-shell.fixtures.tsx";
import { Body } from "#app-shell/body.tsx";

describe("Body", () => {
  it("draws a row inside the column it needs above it", () => {
    const { container } = render(shell(<Body />));

    expect(slotElement(container, "app-shell", "body").tagName).toBe("DIV");
  });

  it("draws its backdrop whether or not anything stands over the page", () => {
    const { container } = render(shell(<Body />));

    expect(slotElement(container, "app-shell", "backdrop").dataset["state"]).toBe("closed");
  });

  it("keeps the backdrop out of what a screen reader reads", () => {
    const { container } = render(shell(<Body />));

    expect(slotElement(container, "app-shell", "backdrop").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("opens the backdrop while a panel stands over the page", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "backdrop").dataset["state"]).toBe("open");
  });

  it("puts every panel over the page away when the backdrop is pressed", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));
    await pressed(slotElement(container, "app-shell", "backdrop"));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("closed");
  });

  it("holds the panels and the page in the order they were written", () => {
    const { container } = render(composed());
    const body = slotElement(container, "app-shell", "body");

    expect([...body.children].map((child) => child.tagName)).toStrictEqual([
      "DIV",
      "MAIN",
      "ASIDE",
      "DIV",
    ]);
  });
});
