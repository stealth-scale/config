import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { listed } from "#nav-list/nav-list.fixtures.tsx";
import { Skeleton } from "#nav-list/skeleton.ts";

describe("Skeleton", () => {
  it("draws a list item inside the list it needs above it", () => {
    const { container } = render(listed(<Skeleton />));

    expect(slotElement(container, "nav-list", "skeleton").tagName).toBe("LI");
  });

  it("draws no placeholder of its own", () => {
    const { container } = render(listed(<Skeleton />));

    expect(slotElement(container, "nav-list", "skeleton").children).toHaveLength(0);
  });
});
