import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Content } from "#blockquote/content.ts";
import { recipe } from "#blockquote/recipe.ts";
import { Root } from "#blockquote/root.ts";

function quoted(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

describe("Content", () => {
  it("conforms as a blockquote element inside the root it needs above it", () => {
    expect(
      violations(Content, {
        as: true,
        children: true,
        element: "BLOCKQUOTE",
        subject: (container) => slotElement(container, "blockquote", "content"),
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
              <Content>Said</Content>
            </Root>,
          ).container,
        { slot: "content" },
      ),
    ).toStrictEqual([]);
  });
});
