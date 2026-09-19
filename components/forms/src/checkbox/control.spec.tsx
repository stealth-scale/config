import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { boxed, composed, pressed } from "#checkbox/checkbox.fixtures.tsx";
import { Control } from "#checkbox/control.tsx";

describe("Control", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(boxed(<Control />));

    expect(slotElement(container, "checkbox", "control").tagName).toBe("DIV");
  });

  it("keeps the box out of the accessibility tree", () => {
    const { container } = render(boxed(<Control />));

    expect(slotElement(container, "checkbox", "control").getAttribute("aria-hidden")).toBe("true");
  });

  it("reports the state the machine is in", async () => {
    const { container } = render(composed());
    await pressed(screen.getByRole("checkbox"));

    expect(slotElement(container, "checkbox", "control").dataset["state"]).toBe("checked");
  });

  it("reports the partly-on state apart from the on state", () => {
    const { container } = render(composed({ checked: "indeterminate" }));

    expect(slotElement(container, "checkbox", "control").dataset["state"]).toBe("indeterminate");
  });

  it("reports a checkbox the field around it marks wrong", () => {
    const { container } = render(composed({ invalid: true }));

    expect(slotElement(container, "checkbox", "control").dataset["invalid"]).toBe("");
  });
});
