import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Caption } from "#blockquote/caption.ts";
import { recipe } from "#blockquote/recipe.ts";
import { Root } from "#blockquote/root.ts";

function quoted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Caption", () => {
  it("conforms as a figcaption element inside the root it needs above it", () => {
    expect(
      violations(Caption, {
        as: true,
        children: true,
        element: "FIGCAPTION",
        subject: (container) => slotElement(container, "blockquote", "caption"),
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
              <Caption>Someone</Caption>
            </Root>,
          ).container,
        { slot: "caption" },
      ),
    ).toStrictEqual([]);
  });
});
