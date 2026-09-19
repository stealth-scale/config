import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Mark } from "#switcher/mark.ts";
import { held } from "#switcher/parts.fixtures.tsx";

describe("Mark", () => {
  it("draws a span inside the control it needs above it", () => {
    const { container } = render(held(<Mark>A</Mark>));

    expect(slotElement(container, "switcher", "mark").tagName).toBe("SPAN");
  });

  it("keeps the mark out of the accessibility tree", () => {
    const { container } = render(held(<Mark>A</Mark>));

    expect(slotElement(container, "switcher", "mark").getAttribute("aria-hidden")).toBe("true");
  });
});
