import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#empty-state/indicator.ts";
import { Root } from "#empty-state/root.ts";

function panelled(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Indicator", () => {
  it("conforms as a div element inside the panel it needs above it", () => {
    expect(
      violations(Indicator, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "empty-state", "indicator"),
        wrapper: panelled,
      }),
    ).toStrictEqual([]);
  });

  it("breaks no accessibility rule where a caller hides the mark", async () => {
    await expect(
      accessibilityViolations(Indicator, {
        props: { "aria-hidden": true, children: "*" },
        wrapper: panelled,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(panelled(<Indicator as="span">*</Indicator>));

    expect(slotElement(container, "empty-state", "indicator").tagName).toBe("SPAN");
  });
});
