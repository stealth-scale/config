import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Banner } from "#page/banner.ts";
import { paged } from "#page/page.fixtures.tsx";

describe("Banner", () => {
  it("draws a div inside the column it needs above it", () => {
    const { container } = render(paged(<Banner>Your trial ends on Friday</Banner>));

    expect(slotElement(container, "page", "banner").tagName).toBe("DIV");
  });

  it("says nothing by itself, leaving the role to what a caller puts inside", () => {
    render(paged(<Banner>Your trial ends on Friday</Banner>));

    expect(screen.queryByRole("alert")).toBeNull();
  });
});
