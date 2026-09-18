import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#tabs/content.tsx";
import { composed, tabbed } from "#tabs/tabs.fixtures.tsx";

describe("Content", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(tabbed(<Content value="first">The panel</Content>));

    expect(slotElement(container, "tabs", "content").tagName).toBe("DIV");
  });

  it("shows the panel whose control is in force", async () => {
    await drawn(composed());

    expect(screen.getByRole("tabpanel").textContent).toBe("The first panel");
  });

  it("hides every panel whose control is not", async () => {
    const { container } = await drawn(composed());
    const panels = [...container.querySelectorAll("[data-part=content]")];

    expect(panels.filter((panel) => panel.hasAttribute("hidden"))).toHaveLength(2);
  });

  it("shows another panel once its control is pressed", async () => {
    await drawn(composed());
    fireEvent.click(screen.getByRole("tab", { name: "Second" }));
    await settled();

    expect(screen.getByRole("tabpanel").textContent).toBe("The second panel");
  });

  it("is named by the control that shows it", async () => {
    await drawn(composed());

    expect(screen.getByRole("tabpanel").getAttribute("aria-labelledby")).toBe(
      screen.getByRole("tab", { name: "First" }).id,
    );
  });

  it("takes a tab stop so a person tabbing out of the strip lands on what they chose", async () => {
    await drawn(composed());

    expect(screen.getByRole("tabpanel").getAttribute("tabindex")).toBe("0");
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(
      tabbed(
        <Content as="section" value="first">
          The panel
        </Content>,
      ),
    );

    expect(slotElement(container, "tabs", "content").tagName).toBe("SECTION");
  });
});
