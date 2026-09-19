import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, narrowed, shell } from "#app-shell/app-shell.fixtures.tsx";
import { Body } from "#app-shell/body.tsx";
import { Navbar } from "#app-shell/navbar.tsx";
import { Trigger } from "#app-shell/trigger.tsx";

describe("Trigger", () => {
  it("draws a control inside the shell it needs above it", () => {
    const { container } = render(shell(<Trigger>Navigation</Trigger>));

    expect(slotElement(container, "app-shell", "trigger").tagName).toBe("BUTTON");
  });

  it("submits nothing a form around the shell holds", () => {
    const { container } = render(shell(<Trigger>Navigation</Trigger>));

    expect(slotElement(container, "app-shell", "trigger").getAttribute("type")).toBe("button");
  });

  it("points at the panel it opens", () => {
    const { container } = render(composed());

    expect(screen.getByRole("button", { name: "Navigation" }).getAttribute("aria-controls")).toBe(
      slotElement(container, "app-shell", "navbar").id,
    );
  });

  it("says whether the panel it points at is shown", () => {
    render(composed());

    expect(screen.getByRole("button", { expanded: true, name: "Navigation" })).toBeTruthy();
  });

  it("says a panel is closed while it points at one nothing has drawn", () => {
    render(shell(<Trigger>Navigation</Trigger>));

    expect(screen.getByRole("button", { expanded: false })).toBeTruthy();
  });

  it("opens the panel it points at", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("open");
  });

  it("closes the panel it points at", async () => {
    const { container } = render(composed());

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("closed");
  });

  it("leaves the panel alone where the caller stopped the press", async () => {
    const { container } = render(
      shell(
        <>
          <Trigger
            onClick={(event) => {
              event.preventDefault();
            }}
          >
            Navigation
          </Trigger>
          <Body>
            <Navbar />
          </Body>
        </>,
      ),
    );

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "navbar").dataset["state"]).toBe("open");
  });

  it("turns its own mark with the panel", () => {
    const { container } = render(composed());

    expect(slotElement(container, "app-shell", "trigger").dataset["state"]).toBe("open");
  });

  it("leaves the document where the panel it points at has dropped under the page", () => {
    render(narrowed(composed({ folds: "under" })));

    expect(screen.queryByRole("button", { name: "Navigation" })).toBeNull();
  });
});
