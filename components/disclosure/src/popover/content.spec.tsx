import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#popover/content.tsx";
import { composed, opened } from "#popover/popover.fixtures.tsx";

describe("Content", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(opened(<Content />));

    expect(slotElement(container, "popover", "content").tagName).toBe("DIV");
  });

  it("carries the dialog role so a screen reader knows what opened", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("is announced by the heading inside it", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog").getAttribute("aria-labelledby")).toBe(
      screen.getByRole("heading", { name: "Filter the list" }).id,
    );
  });

  it("is described by the paragraph inside it", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog").getAttribute("aria-describedby")).toBe(
      slotElement(container, "popover", "description").id,
    );
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(opened(<Content as="section" />));

    expect(slotElement(container, "popover", "content").tagName).toBe("SECTION");
  });
});
