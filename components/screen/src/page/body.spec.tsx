import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Body } from "#page/body.ts";
import { paged } from "#page/page.fixtures.tsx";

describe("Body", () => {
  it("draws a div inside the column it needs above it", () => {
    const { container } = render(paged(<Body>The lines</Body>));

    expect(slotElement(container, "page", "body").tagName).toBe("DIV");
  });
});
