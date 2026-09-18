import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#empty-state/context.ts";

describe("context", () => {
  it("draws the root's slot class on the element it binds", () => {
    const Root = withProvider("div", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "empty-state", "root")).toContain("empty-state__root");
  });

  it("hands the root's variants to a part below it", () => {
    const Root = withProvider("div", "root");
    const Title = withContext("h2", "title");
    const { container } = render(
      createElement(Root, { size: "lg" }, createElement(Title, null, "Nothing here")),
    );

    expect(slotClasses(container, "empty-state", "title")).toContain(
      slotVariantClass("empty-state", "title", "size", "lg"),
    );
  });
});
