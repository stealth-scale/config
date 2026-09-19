import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { bodied, composed, narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Panel } from "#app-shell/panel.tsx";

describe("Panel", () => {
  it("breaks no accessibility rule while it stands over the page", async () => {
    await expect(
      accessibilityViolations(() => narrowed(composed({ open: true }))),
    ).resolves.toStrictEqual([]);
  });

  it("draws what it holds at the width the panel opens to", () => {
    const { container } = render(bodied(<Panel side="start">Destinations</Panel>));

    expect(slotElement(container, "app-shell", "content").textContent).toBe("Destinations");
  });

  it("opens where nothing says otherwise", () => {
    const { container } = render(bodied(<Panel side="start" />));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("open");
  });

  it("starts closed where it is told to", () => {
    const { container } = render(bodied(<Panel defaultOpen={false} side="start" />));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("closed");
  });

  it("takes the state the application controls", () => {
    const { container } = render(bodied(<Panel open={false} side="start" />));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("closed");
  });

  it("takes neither a press nor a Tab where it is closed to nothing", () => {
    const { container } = render(bodied(<Panel defaultOpen={false} side="start" />));

    expect(slotElement(container, "app-shell", "navbar").inert).toBe(true);
  });

  it("stays reachable where it is closed to a rail of marks", () => {
    const { container } = render(
      bodied(<Panel collapse="icons" defaultOpen={false} side="start" />),
    );

    expect(slotElement(container, "app-shell", "navbar").inert).toBe(false);
  });

  it("states how much closing it leaves", () => {
    const { container } = render(bodied(<Panel collapse="icons" side="start" />));

    expect(slotElement(container, "app-shell", "navbar").dataset["collapse"]).toBe("icons");
  });

  it("starts closed over the page whatever it was beside it", () => {
    const { container } = render(narrowed(bodied(<Panel side="start" />)));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("closed");
  });

  it("stands open over the page where the application states it is open", () => {
    const { container } = render(narrowed(bodied(<Panel open side="start" />)));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("open");
  });

  it("opens and closes on a press of the control that points at it", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("open");
  });

  it("takes the reader into the sheet it lays over the page", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(document.activeElement).toBe(slotElement(container, "app-shell", "content"));
  });

  it("puts the reader back on the control that opened the sheet", async () => {
    const { container } = render(narrowed(composed()));
    const trigger = screen.getByRole("button", { name: "Navigation" });

    trigger.focus();
    await pressed(trigger);

    expect(document.activeElement).toBe(slotElement(container, "app-shell", "content"));

    await pressed(slotElement(container, "app-shell", "backdrop"));

    expect(document.activeElement).toBe(trigger);
  });

  it("addresses itself so a control elsewhere can point at it", () => {
    const { container } = render(bodied(<Panel side="start" />));

    expect(slotElement(container, "app-shell", "navbar").id).not.toBe("");
  });
});
