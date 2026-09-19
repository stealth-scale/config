import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Leading } from "#page/leading.ts";
import { paged } from "#page/page.fixtures.tsx";

describe("Leading", () => {
  it("draws a div inside the column it needs above it", () => {
    const { container } = render(paged(<Leading>A</Leading>));

    expect(slotElement(container, "page", "leading").tagName).toBe("DIV");
  });
});
