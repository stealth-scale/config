import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Item } from "#nav-list/item.ts";
import { listed } from "#nav-list/nav-list.fixtures.tsx";

describe("Item", () => {
  it("draws a list item inside the list it needs above it", () => {
    const { container } = render(listed(<Item>Overview</Item>));

    expect(slotElement(container, "nav-list", "item").tagName).toBe("LI");
  });
});
