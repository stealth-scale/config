import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Meta } from "#page/meta.ts";
import { paged } from "#page/page.fixtures.tsx";

describe("Meta", () => {
  it("draws a div inside the column it needs above it", () => {
    const { container } = render(paged(<Meta>Paid</Meta>));

    expect(slotElement(container, "page", "meta").tagName).toBe("DIV");
  });
});
