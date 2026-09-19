import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#input-group/input-group.fixtures.tsx";
import { recipe } from "#input-group/recipe.ts";
import { Root, type RootProps } from "#input-group/root.ts";

describe("Root", () => {
  it("conforms as a div", () => {
    expect(violations(Root, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding a field and both marks", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("carries no role because the field inside it keeps its own", () => {
    const { container } = render(composed());

    expect(slotElement(container, "input-group", "root").hasAttribute("role")).toBe(false);
  });

  it("draws the element as names", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "input-group", "root").tagName).toBe("SECTION");
  });
});
