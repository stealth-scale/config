import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { trailed } from "#breadcrumb/breadcrumb.fixtures.tsx";
import { Separator } from "#breadcrumb/separator.ts";

describe("Separator", () => {
  it("conforms as a list row inside the landmark it needs above it", () => {
    expect(
      violations(Separator, {
        as: true,
        children: true,
        element: "LI",
        subject: (container) => slotElement(container, "breadcrumb", "separator"),
        wrapper: trailed,
      }),
    ).toStrictEqual([]);
  });

  it("says nothing to a screen reader because the list already carries the order", () => {
    const { container } = render(trailed(<Separator>/</Separator>));
    const mark = slotElement(container, "breadcrumb", "separator");

    expect(mark.getAttribute("aria-hidden")).toBe("true");
    expect(mark.getAttribute("role")).toBe("presentation");
  });
});
