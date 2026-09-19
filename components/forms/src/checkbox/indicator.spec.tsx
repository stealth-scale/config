import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { boxed, composed, pressed } from "#checkbox/checkbox.fixtures.tsx";
import { Indicator } from "#checkbox/indicator.tsx";

describe("Indicator", () => {
  it("draws a span inside the root it needs above it", () => {
    const { container } = render(boxed(<Indicator>t</Indicator>));

    expect(slotElement(container, "checkbox", "indicator").tagName).toBe("SPAN");
  });

  it("hides the mark while the checkbox is off", () => {
    const { container } = render(boxed(<Indicator>t</Indicator>));

    expect(slotElement(container, "checkbox", "indicator").hidden).toBe(true);
  });

  it("shows the mark once the checkbox is on", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("checkbox"));

    expect(slotElement(container, "checkbox", "indicator").hidden).toBe(false);
  });

  it("draws the on mark for a checkbox that is on", () => {
    render(composed({ defaultChecked: true }));

    expect(screen.getByText("t").hidden).toBe(false);
    expect(screen.getByText("-").hidden).toBe(true);
  });

  it("draws the partly-on mark for a checkbox that is partly on", () => {
    render(composed({ checked: "indeterminate" }));

    expect(screen.getByText("-").hidden).toBe(false);
    expect(screen.getByText("t").hidden).toBe(true);
  });

  it("hides the on mark while the checkbox is partly on", () => {
    const { container } = render(boxed(<Indicator>t</Indicator>, { checked: "indeterminate" }));

    expect(slotElement(container, "checkbox", "indicator").hidden).toBe(true);
  });
});
