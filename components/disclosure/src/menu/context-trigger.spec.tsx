import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { attr, drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { ContextTrigger } from "#menu/context-trigger.tsx";
import { listed, righted } from "#menu/menu.fixtures.tsx";

describe("ContextTrigger", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(listed(<ContextTrigger>A row</ContextTrigger>));

    expect(slotElement(container, "menu", "contextTrigger").tagName).toBe("DIV");
  });

  it("says whether the menu it opens is up", async () => {
    const { container } = await drawn(righted());

    expect(attr(container, "context-trigger", "state")).toBe("closed");
  });

  it("opens the menu where the pointer is", async () => {
    const { container } = await drawn(righted());

    fireEvent.contextMenu(slotElement(container, "menu", "contextTrigger"));
    await settled();

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("names itself where a caller shares one menu between several regions", async () => {
    const { container } = await drawn(listed(<ContextTrigger value="row-7">A row</ContextTrigger>));

    expect(slotElement(container, "menu", "contextTrigger").dataset["value"]).toBe("row-7");
  });

  it("carries no value where a caller names none", async () => {
    const { container } = await drawn(listed(<ContextTrigger>A row</ContextTrigger>));

    expect(slotElement(container, "menu", "contextTrigger").dataset["value"]).toBeUndefined();
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(listed(<ContextTrigger as="li">A row</ContextTrigger>));

    expect(slotElement(container, "menu", "contextTrigger").tagName).toBe("LI");
  });
});
