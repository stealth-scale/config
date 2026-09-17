import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotClass, slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { Root } from "#blockquote/root.ts";

describe("Root", () => {
  it("conforms as a figure element", () => {
    expect(violations(Root, { as: true, children: true, element: "FIGURE" })).toStrictEqual([]);
  });

  it("draws its slot class and the classes of the default variants", () => {
    const { container } = render(<Root />);

    expect(slotClasses(container, "blockquote", "root")).toStrictEqual(
      [
        slotClass("blockquote", "root"),
        slotVariantClass("blockquote", "root", "justify", "start"),
        slotVariantClass("blockquote", "root", "size", "md"),
        slotVariantClass("blockquote", "root", "variant", "subtle"),
      ].toSorted(),
    );
  });

  it("draws the class of the look a caller picks", () => {
    const { container } = render(<Root variant="glass" />);

    expect(slotClasses(container, "blockquote", "root")).toContain(
      slotVariantClass("blockquote", "root", "variant", "glass"),
    );
  });

  it("draws the class of the status a caller picks", () => {
    const { container } = render(<Root status="warning" />);

    expect(slotClasses(container, "blockquote", "root")).toContain(
      slotVariantClass("blockquote", "root", "status", "warning"),
    );
  });

  it("draws the class of the motion a caller picks", () => {
    const { container } = render(<Root motion="reveal" />);

    expect(slotClasses(container, "blockquote", "root")).toContain(
      slotVariantClass("blockquote", "root", "motion", "reveal"),
    );
  });

  it("draws the element as names", () => {
    const { container } = render(<Root as="aside" />);

    expect(slotElement(container, "blockquote", "root").tagName).toBe("ASIDE");
  });
});
