import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#blockquote/context.ts";

describe("context", () => {
  it("draws each part's slot class", () => {
    const Root = withProvider("div", "root");
    const Content = withContext("p", "content");
    const { container } = render(createElement(Root, null, createElement(Content, null, "Said")));

    expect(slotClasses(container, "blockquote", "root")).toContain("blockquote__root");
    expect(slotClasses(container, "blockquote", "content")).toContain("blockquote__content");
  });

  it("hands the root's variants to a part below it", () => {
    const Root = withProvider("div", "root");
    const Content = withContext("p", "content");
    const { container } = render(
      createElement(Root, { size: "lg" }, createElement(Content, null, "Said")),
    );

    expect(slotClasses(container, "blockquote", "content")).toContain(
      slotVariantClass("blockquote", "content", "size", "lg"),
    );
  });
});
