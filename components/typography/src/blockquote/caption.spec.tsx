import { type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotClass, slotClasses, slotElement } from "@stealthscale/testing-theme";

import { Caption } from "#blockquote/caption.ts";
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

  it("draws its slot class and no variant class because no value styles it", () => {
    const { container } = render(quoted(<Caption>Someone</Caption>));

    expect(slotClasses(container, "blockquote", "caption")).toStrictEqual([
      slotClass("blockquote", "caption"),
    ]);
  });
});
