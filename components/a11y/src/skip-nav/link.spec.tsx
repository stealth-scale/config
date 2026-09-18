import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Link, SKIP_NAV_TARGET } from "#skip-nav/link.ts";

describe("Link", () => {
  it("conforms as an anchor element", () => {
    expect(violations(Link, { as: true, children: true, element: "A" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Link, { props: { children: "Skip to content" } }),
    ).resolves.toStrictEqual([]);
  });

  it("points at the target where a page states no other", () => {
    const { container } = render(<Link>Skip to content</Link>);

    expect(slotElement(container, "skip-nav", "link").getAttribute("href")).toBe(
      `#${SKIP_NAV_TARGET}`,
    );
  });

  it("points where a page sends it", () => {
    const { container } = render(<Link href="#search">Skip to search</Link>);

    expect(slotElement(container, "skip-nav", "link").getAttribute("href")).toBe("#search");
  });

  it("is a link a keyboard reaches", () => {
    const { getByRole } = render(<Link>Skip to content</Link>);

    expect(getByRole("link", { name: "Skip to content" })).toBeDefined();
  });
});
