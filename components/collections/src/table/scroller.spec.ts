import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#table/recipe.ts";
import { Scroller, type ScrollerProps } from "#table/scroller.ts";
import { composed } from "#table/table.fixtures.tsx";

describe("Scroller", () => {
  it("conforms as a div", () => {
    expect(violations(Scroller, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding a whole table", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: ScrollerProps) => render(composed(props)).container, {
        slot: "scroller",
      }),
    ).toStrictEqual([]);
  });

  it("is reachable by a keyboard", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "scroller").getAttribute("tabindex")).toBe("0");
  });

  it("takes the name the caption gives it", () => {
    const { container } = render(composed());

    expect(slotElement(container, "table", "scroller").getAttribute("aria-labelledby")).toBe(
      "table-caption",
    );
  });

  it("draws the element as names", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "table", "scroller").tagName).toBe("SECTION");
  });
});
