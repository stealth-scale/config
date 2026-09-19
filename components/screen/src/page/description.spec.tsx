import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Description } from "#page/description.ts";
import { paged } from "#page/page.fixtures.tsx";

describe("Description", () => {
  it("draws a paragraph inside the column it needs above it", () => {
    const { container } = render(paged(<Description>What this covers.</Description>));

    expect(slotElement(container, "page", "description").tagName).toBe("P");
  });
});
