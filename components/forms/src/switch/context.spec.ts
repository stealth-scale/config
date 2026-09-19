import { createElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { withContext, withProvider } from "#switch/context.ts";

describe("context", () => {
  it("draws the slot's class on an element it binds", () => {
    const Row = withProvider("label", "root");
    const Tracked = withContext("span", "control");
    const { container } = render(createElement(Row, null, createElement(Tracked)));

    expect(slotClasses(container, "switch", "control")).toContain(slotClass("switch", "control"));
  });

  it("hands the root's variants to the track below it", () => {
    const Row = withProvider("label", "root");
    const Tracked = withContext("span", "control");
    const { container } = render(createElement(Row, { radius: "l1" }, createElement(Tracked)));

    expect(slotClasses(container, "switch", "control")).toContain(
      variantClass(slotClass("switch", "control"), "radius", "l1"),
    );
  });
});
