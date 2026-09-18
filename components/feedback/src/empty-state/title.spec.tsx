import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Root } from "#empty-state/root.ts";
import { Title } from "#empty-state/title.ts";

function panelled(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Title", () => {
  it("conforms as a second-level heading inside the panel it needs above it", () => {
    expect(
      violations(Title, {
        as: true,
        children: true,
        element: "H2",
        subject: (container) => slotElement(container, "empty-state", "title"),
        wrapper: panelled,
      }),
    ).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Title, {
        props: { children: "Nothing here yet" },
        wrapper: panelled,
      }),
    ).resolves.toStrictEqual([]);
  });

  it("draws the level a page's own outline asks for", () => {
    const { container } = render(panelled(<Title as="h3">Nothing here yet</Title>));

    expect(slotElement(container, "empty-state", "title").tagName).toBe("H3");
  });
});
