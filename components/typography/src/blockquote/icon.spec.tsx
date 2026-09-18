import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import {
  boundViolations,
  slotClasses,
  slotElement,
  variantClass,
} from "@stealthscale/testing-theme";

import { Icon } from "#blockquote/icon.ts";
import { recipe } from "#blockquote/recipe.ts";
import { Root } from "#blockquote/root.ts";

function quoted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Icon", () => {
  it("conforms as an svg element inside the root it needs above it", () => {
    expect(
      violations(Icon, {
        as: true,
        children: true,
        element: "SVG",
        subject: (container) => slotElement(container, "blockquote", "icon"),
        wrapper: quoted,
      }),
    ).toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props) =>
          render(
            <Root {...props}>
              <Icon />
            </Root>,
          ).container,
        { slot: "icon" },
      ),
    ).toStrictEqual([]);
  });

  it("takes the icon's size axis", () => {
    const { container } = render(quoted(<Icon size="lg" />));

    expect(slotClasses(container, "blockquote", "icon")).toContain(
      variantClass("icon", "size", "lg"),
    );
  });

  it("draws the artwork it was given", () => {
    const { container } = render(
      quoted(
        <Icon viewBox="0 0 24 24">
          <path d="M4 12h16" />
        </Icon>,
      ),
    );

    expect(slotElement(container, "blockquote", "icon").querySelector("path")).not.toBeNull();
  });
});
