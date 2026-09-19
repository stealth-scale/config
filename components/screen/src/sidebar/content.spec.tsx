import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#sidebar/content.ts";
import { aside } from "#sidebar/sidebar.fixtures.tsx";

describe("Content", () => {
  it("draws the middle band inside the column it needs above it", () => {
    const { container } = render(aside(<Content />));

    expect(slotElement(container, "sidebar", "content").tagName).toBe("DIV");
  });

  it("holds the blocks that scroll", () => {
    const { container } = render(
      aside(
        <Content>
          <a href="/invoices">Invoices</a>
        </Content>,
      ),
    );

    expect(slotElement(container, "sidebar", "content").textContent).toBe("Invoices");
  });
});
