import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { End } from "#input-group/end.ts";
import { composed, grouped } from "#input-group/input-group.fixtures.tsx";
import { recipe } from "#input-group/recipe.ts";
import { type RootProps } from "#input-group/root.ts";

describe("End", () => {
  it("draws a div inside the root it needs above it", () => {
    const { container } = render(grouped(<End>kg</End>));

    expect(slotElement(container, "input-group", "end").tagName).toBe("DIV");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "end",
      }),
    ).toStrictEqual([]);
  });

  it("draws what a caller puts in it", () => {
    const { container } = render(grouped(<End>kg</End>));

    expect(slotElement(container, "input-group", "end").textContent).toBe("kg");
  });
});
