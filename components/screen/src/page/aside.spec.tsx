import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Aside } from "#page/aside.ts";
import { paged } from "#page/page.fixtures.tsx";

describe("Aside", () => {
  it("draws an aside inside the column it needs above it", () => {
    const { container } = render(paged(<Aside aria-label="Activity">Events</Aside>));

    expect(slotElement(container, "page", "aside").tagName).toBe("ASIDE");
  });

  it("is a landmark a reader can name and jump to", () => {
    render(paged(<Aside aria-label="Activity">Events</Aside>));

    expect(screen.getByRole("complementary", { name: "Activity" })).toBeTruthy();
  });
});
