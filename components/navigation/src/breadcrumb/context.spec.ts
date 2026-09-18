import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#breadcrumb/context.ts";

describe("context", () => {
  it("draws the root's slot class on the element it binds", () => {
    const Root = withProvider("nav", "root");
    const { container } = render(createElement(Root));

    expect(slotClasses(container, "breadcrumb", "root")).toContain("breadcrumb__root");
  });

  it("hands the root's variants to a part below it", () => {
    const Root = withProvider("nav", "root");
    const List = withContext("ol", "list");
    const { container } = render(createElement(Root, { size: "lg" }, createElement(List)));

    expect(slotClasses(container, "breadcrumb", "list")).toContain(
      slotVariantClass("breadcrumb", "list", "size", "lg"),
    );
  });
});
