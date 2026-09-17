import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import {
  slotClass,
  slotClasses,
  slotElement,
  slotVariantClass,
  variantClass,
} from "@stealthscale/testing-theme";

import { Icon } from "#blockquote/icon.ts";
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

  it("draws its slot class and the class of the default look beside the icon's own classes", () => {
    const { container } = render(quoted(<Icon />));

    expect(slotClasses(container, "blockquote", "icon")).toStrictEqual(
      [
        "icon",
        variantClass("icon", "size", "inherit"),
        slotClass("blockquote", "icon"),
        slotVariantClass("blockquote", "icon", "variant", "subtle"),
      ].toSorted(),
    );
  });

  it("takes the icon's size axis", () => {
    const { container } = render(quoted(<Icon size="lg" />));

    expect(slotClasses(container, "blockquote", "icon")).toContain(
      variantClass("icon", "size", "lg"),
    );
  });

  it("draws the class of the look the root was given", () => {
    const { container } = render(
      <Root variant="solid">
        <Icon />
      </Root>,
    );

    expect(slotClasses(container, "blockquote", "icon")).toContain(
      slotVariantClass("blockquote", "icon", "variant", "solid"),
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
