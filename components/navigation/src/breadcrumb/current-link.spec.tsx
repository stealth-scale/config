import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { trailed } from "#breadcrumb/breadcrumb.fixtures.tsx";
import { CurrentLink } from "#breadcrumb/current-link.ts";

describe("CurrentLink", () => {
  it("conforms as a span inside the landmark it needs above it", () => {
    expect(
      violations(CurrentLink, {
        as: true,
        children: true,
        element: "SPAN",
        subject: (container) => slotElement(container, "breadcrumb", "currentLink"),
        wrapper: trailed,
      }),
    ).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(CurrentLink, {
        props: { children: "This invoice" },
        wrapper: trailed,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("tells a screen reader which crumb of the trail is the page a person is on", () => {
    const { container } = render(trailed(<CurrentLink>This invoice</CurrentLink>));

    expect(slotElement(container, "breadcrumb", "currentLink").getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("draws no anchor because a link to the page already open does nothing", () => {
    const { container } = render(trailed(<CurrentLink>This invoice</CurrentLink>));

    expect(slotElement(container, "breadcrumb", "currentLink").tagName).toBe("SPAN");
  });
});
