import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import {
  recipeElement,
  slotClass,
  slotClasses,
  slotElement,
  slotVariantClass,
} from "@stealthscale/testing-theme";

import { Root } from "#list/root.ts";

describe("Root", () => {
  it("conforms as a list element", () => {
    expect(violations(Root, { as: true, children: true, element: "UL" })).toStrictEqual([]);
  });

  it("states the list role so a reader counts entries whose markers are gone", () => {
    const { container } = render(<Root />);

    expect(recipeElement(container, "list").getAttribute("role")).toBe("list");
  });

  it("draws its slot class and the classes of the default variants", () => {
    const { container } = render(<Root />);

    expect(slotClasses(container, "list", "root")).toStrictEqual(
      [
        slotClass("list", "root"),
        slotVariantClass("list", "root", "gap", "md"),
        slotVariantClass("list", "root", "variant", "marker"),
      ].toSorted(),
    );
  });

  it("draws the class of the gap a caller picks", () => {
    const { container } = render(<Root gap="xl" />);

    expect(slotClasses(container, "list", "root")).toContain(
      slotVariantClass("list", "root", "gap", "xl"),
    );
  });

  it("draws no class for an alignment on the root because the alignment styles the entries", () => {
    const { container } = render(<Root align="center" />);

    expect(slotClasses(container, "list", "root")).not.toContain(
      slotVariantClass("list", "root", "align", "center"),
    );
  });

  it("draws the element as names", () => {
    const { container } = render(<Root as="ol" />);

    expect(slotElement(container, "list", "root").tagName).toBe("OL");
  });
});
