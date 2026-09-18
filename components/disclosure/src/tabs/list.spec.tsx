import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { List } from "#tabs/list.tsx";
import { composed, tabbed } from "#tabs/tabs.fixtures.tsx";

describe("List", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(tabbed(<List />));

    expect(slotElement(container, "tabs", "list").tagName).toBe("DIV");
  });

  it("tells a screen reader the controls inside it are one set", async () => {
    await drawn(composed());

    expect(screen.getByRole("tablist")).toBeDefined();
  });

  it("says which way the set runs so a reader knows which arrows move between them", async () => {
    const { container } = await drawn(composed({ orientation: "vertical" }));

    expect(slotElement(container, "tabs", "list").getAttribute("aria-orientation")).toBe(
      "vertical",
    );
  });

  it("moves between the controls on an arrow key", async () => {
    await drawn(composed());

    const first = screen.getByRole("tab", { name: "First" });

    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    await settled();

    expect(screen.getByRole("tab", { name: "Second" }).getAttribute("aria-selected")).toBe("true");
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(tabbed(<List as="nav" />));

    expect(slotElement(container, "tabs", "list").tagName).toBe("NAV");
  });
});
