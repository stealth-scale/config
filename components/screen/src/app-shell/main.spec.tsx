import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { bodied, composed, narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Main } from "#app-shell/main.tsx";

describe("Main", () => {
  it("draws the middle inside the body it needs above it", () => {
    const { container } = render(bodied(<Main>Billing</Main>));

    expect(slotElement(container, "app-shell", "main").tagName).toBe("MAIN");
  });

  it("is the landmark a reader jumps to for the application's own work", () => {
    render(bodied(<Main>Billing</Main>));

    expect(screen.getByRole("main")).toBeTruthy();
  });

  it("takes a Tab while nothing stands over the page", () => {
    const { container } = render(composed());

    expect(slotElement(container, "app-shell", "main").inert).toBe(false);
  });

  it("takes neither a press nor a Tab while a panel stands over the page", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "main").inert).toBe(true);
  });
});
