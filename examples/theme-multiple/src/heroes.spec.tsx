import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { variantClass } from "@stealthscale/testing-theme";

import { Heroes } from "#heroes.tsx";

describe("Heroes", () => {
  it("draws three calls to action from 2xl to 4xl", () => {
    const { getAllByRole } = render(<Heroes />);
    const heroes = getAllByRole("button", { name: "Start free" });

    expect(heroes).toHaveLength(3);
    expect(heroes[2]?.className).toContain(variantClass("button", "size", "4xl"));
  });

  it("names the button by its words and hides the icon beside them", () => {
    const { getByRole } = render(<Heroes />);
    const button = getByRole("button", { name: "Attach" });

    expect(button.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
