import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { bodied, narrowed, tablet } from "#app-shell/app-shell.fixtures.tsx";
import { Aside } from "#app-shell/aside.tsx";

describe("Aside", () => {
  it("draws a track inside the body it needs above it", () => {
    const { container } = render(bodied(<Aside />));

    expect(slotElement(container, "app-shell", "aside").tagName).toBe("ASIDE");
  });

  it("is a landmark a screen reader can jump to", () => {
    render(bodied(<Aside aria-label="Detail" />));

    expect(screen.getByRole("complementary", { name: "Detail" })).toBeTruthy();
  });

  it("folds at a wider screen than the start side does", () => {
    const { container } = render(tablet(bodied(<Aside aria-label="Detail" />)));

    expect(slotElement(container, "app-shell", "aside").dataset["overlaid"]).toBe("");
  });

  it("leaves the body once the shell is too narrow to hold it beside the page", () => {
    const { container } = render(narrowed(bodied(<Aside />)));

    expect(slotElement(container, "app-shell", "aside").dataset["overlaid"]).toBe("");
  });

  it("drops under the page as a block that is always shown", () => {
    const { container } = render(narrowed(bodied(<Aside folds="under" />)));
    const track = slotElement(container, "app-shell", "aside");

    expect(track.dataset["stacked"]).toBe("");
    expect(track.dataset["state"]).toBe("open");
  });
});
