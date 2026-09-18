import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { SKIP_NAV_TARGET } from "#skip-nav/link.ts";
import { Target } from "#skip-nav/target.ts";

describe("Target", () => {
  it("conforms as a div element", () => {
    expect(violations(Target, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding a paragraph", async () => {
    await expect(
      accessibilityViolations(Target, { props: { children: <p>One</p> } }),
    ).resolves.toStrictEqual([]);
  });

  it("answers to the fragment the link points at", () => {
    const { container } = render(<Target />);

    expect(slotElement(container, "skip-nav", "target").getAttribute("id")).toBe(SKIP_NAV_TARGET);
  });

  it("holds the focus a fragment sends without joining the tab order", () => {
    const { container } = render(<Target />);

    expect(slotElement(container, "skip-nav", "target").getAttribute("tabindex")).toBe("-1");
  });

  it("draws the element as names", () => {
    const { container } = render(<Target as="main" />);

    expect(slotElement(container, "skip-nav", "target").tagName).toBe("MAIN");
  });
});
