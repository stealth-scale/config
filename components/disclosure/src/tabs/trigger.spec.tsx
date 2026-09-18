import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { settled } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#tabs/recipe.ts";
import { type RootProps } from "#tabs/root.tsx";
import { composed, tabbed } from "#tabs/tabs.fixtures.tsx";
import { Trigger } from "#tabs/trigger.tsx";

describe("Trigger", () => {
  it("draws a button inside the root it needs above it", () => {
    const { container } = render(tabbed(<Trigger value="first">First</Trigger>));

    expect(slotElement(container, "tabs", "trigger").tagName).toBe("BUTTON");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "trigger",
      }),
    ).toStrictEqual([]);
  });

  it("carries the tab role and says whether it is the one in force", () => {
    render(composed());

    expect(screen.getByRole("tab", { name: "First" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "Second" }).getAttribute("aria-selected")).toBe("false");
  });

  it("names the panel it shows", () => {
    render(composed());

    expect(screen.getByRole("tab", { name: "First" }).getAttribute("aria-controls")).toBeTruthy();
  });

  it("holds the only tab stop of the strip so a keyboard reaches the set once", () => {
    render(composed());

    expect(screen.getByRole("tab", { name: "First" }).getAttribute("tabindex")).toBe("0");
    expect(screen.getByRole("tab", { name: "Second" }).getAttribute("tabindex")).toBe("-1");
  });

  it("is disabled where a caller says so", () => {
    render(composed());

    expect(screen.getByRole("tab", { name: "Third" }).hasAttribute("disabled")).toBe(true);
  });

  it("keeps a handler a caller hands it beside the machine's own", async () => {
    const heard = vi.fn<() => void>();

    render(
      tabbed(
        <Trigger onClick={heard} value="first">
          First
        </Trigger>,
      ),
    );
    fireEvent.click(screen.getByRole("tab", { name: "First" }));
    await settled();

    expect(heard).toHaveBeenCalledOnce();
  });
});
