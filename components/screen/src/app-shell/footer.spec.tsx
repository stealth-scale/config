import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, narrowed, shell } from "#app-shell/app-shell.fixtures.tsx";
import { Footer } from "#app-shell/footer.tsx";

describe("Footer", () => {
  it("draws a bar inside the column it needs above it", () => {
    const { container } = render(shell(<Footer>Acme</Footer>));

    expect(slotElement(container, "app-shell", "footer").tagName).toBe("FOOTER");
  });

  it("is a landmark a screen reader can jump to", () => {
    render(shell(<Footer>Acme</Footer>));

    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });

  it("stands still where nothing tells it to pin", () => {
    const { container } = render(shell(<Footer>Acme</Footer>));

    expect(slotElement(container, "app-shell", "footer").dataset["sticky"]).toBeUndefined();
  });

  it("pins where it is told to", () => {
    const { container } = render(shell(<Footer sticky>Acme</Footer>));

    expect(slotElement(container, "app-shell", "footer").dataset["sticky"]).toBe("");
  });

  it("takes neither a press nor a Tab while a panel stands over the page", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "footer").inert).toBe(true);
  });
});
