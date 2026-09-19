import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, narrowed, shell } from "#app-shell/app-shell.fixtures.tsx";
import { Header } from "#app-shell/header.tsx";

describe("Header", () => {
  it("draws a bar inside the column it needs above it", () => {
    const { container } = render(shell(<Header>Acme</Header>));

    expect(slotElement(container, "app-shell", "header").tagName).toBe("HEADER");
  });

  it("is a landmark a screen reader can jump to", () => {
    render(shell(<Header>Acme</Header>));

    expect(screen.getByRole("banner")).toBeTruthy();
  });

  it("stands still where nothing tells it to pin", () => {
    const { container } = render(shell(<Header>Acme</Header>));

    expect(slotElement(container, "app-shell", "header").dataset["sticky"]).toBeUndefined();
  });

  it("pins where it is told to", () => {
    const { container } = render(shell(<Header sticky>Acme</Header>));

    expect(slotElement(container, "app-shell", "header").dataset["sticky"]).toBe("");
  });

  it("takes a Tab while nothing stands over the page", () => {
    const { container } = render(composed());

    expect(slotElement(container, "app-shell", "header").inert).toBe(false);
  });

  it("takes neither a press nor a Tab while a panel stands over the page", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "header").inert).toBe(true);
  });
});
