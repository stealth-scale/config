import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotClass, slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { Content } from "#blockquote/content.ts";
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

  it("draws its slot class and the class of the default size", () => {
    const { container } = render(quoted(<Content>Said</Content>));

    expect(slotClasses(container, "blockquote", "content")).toStrictEqual([
      slotClass("blockquote", "content"),
      slotVariantClass("blockquote", "content", "size", "md"),
    ]);
  });

  it("draws the class of the size the root was given", () => {
    const { container } = render(
      <Root size="lg">
        <Content>Said</Content>
      </Root>,
    );

    expect(slotClasses(container, "blockquote", "content")).toContain(
      slotVariantClass("blockquote", "content", "size", "lg"),
    );
  });

  it("draws no class for the look because the look styles the root and the icon", () => {
    const { container } = render(
      <Root variant="solid">
        <Content>Said</Content>
      </Root>,
    );

    expect(slotClasses(container, "blockquote", "content")).not.toContain(
      slotVariantClass("blockquote", "content", "variant", "solid"),
    );
  });
});
