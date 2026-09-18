import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#list/indicator.ts";
import { Item } from "#list/item.ts";
import { recipe } from "#list/recipe.ts";
import { Root } from "#list/root.ts";

function listed(children: ReactNode): ReactElement {
  return (
    <Root variant="plain">
      <Item>{children}</Item>
    </Root>
  );
}

describe("Indicator", () => {
  it("conforms as a span element inside the root it needs above it", () => {
    expect(
      violations(Indicator, {
        as: true,
        children: true,
        element: "SPAN",
        subject: (container) => slotElement(container, "list", "indicator"),
        wrapper: listed,
      }),
    ).toStrictEqual([]);
  });

  it("breaks no accessibility rule beside an entry", async () => {
    await expect(
      accessibilityViolations(Indicator, { props: { children: "•" }, wrapper: listed }),
    ).resolves.toStrictEqual([]);
  });

  it("hides the mark from assistive technology", () => {
    const { container } = render(listed(<Indicator>•</Indicator>));

    expect(slotElement(container, "list", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props) =>
          render(
            <Root {...props}>
              <Item>
                <Indicator>•</Indicator>
              </Item>
            </Root>,
          ).container,
        { slot: "indicator" },
      ),
    ).toStrictEqual([]);
  });
});
