import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Caption } from "#blockquote/caption.ts";
import { Content } from "#blockquote/content.ts";
import { recipe } from "#blockquote/recipe.ts";
import { Root } from "#blockquote/root.ts";

describe("Root", () => {
  it("conforms as a figure element", () => {
    expect(violations(Root, { as: true, children: true, element: "FIGURE" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding a quotation and a caption", async () => {
    await expect(
      accessibilityViolations(Root, {
        props: {
          children: (
            <>
              <Content>Said</Content>
              <Caption>Someone</Caption>
            </>
          ),
        },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Root {...props} />).container, { slot: "root" }),
    ).toStrictEqual([]);
  });

  it("draws the element as names", () => {
    const { container } = render(<Root as="aside" />);

    expect(slotElement(container, "blockquote", "root").tagName).toBe("ASIDE");
  });
});
