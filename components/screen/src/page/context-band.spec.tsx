import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Context } from "#page/context-band.ts";
import { paged } from "#page/page.fixtures.tsx";

describe("Context", () => {
  it("draws a div inside the column it needs above it", () => {
    const { container } = render(paged(<Context>Billing</Context>));

    expect(slotElement(container, "page", "context").tagName).toBe("DIV");
  });
});
