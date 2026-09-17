import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { recipeClasses, recipeElement, variantClass } from "@stealthscale/testing-theme";

import { Icon } from "#icon/icon.ts";

describe("Icon", () => {
  it("conforms as an svg element", () => {
    expect(violations(Icon, { as: true, children: true, element: "SVG" })).toStrictEqual([]);
  });

  it("draws the recipe's class and the class of the inherited size", () => {
    const { container } = render(<Icon />);

    expect(recipeClasses(container, "icon")).toStrictEqual([
      "icon",
      variantClass("icon", "size", "inherit"),
    ]);
  });

  it("draws the artwork it was given", () => {
    const { container } = render(
      <Icon viewBox="0 0 24 24">
        <path d="M4 12h16" />
      </Icon>,
    );

    expect(recipeElement(container, "icon").querySelector("path")).not.toBeNull();
  });

  it("hides itself from assistive technology unless a caller labels it", () => {
    const hidden = render(<Icon />);
    const labelled = render(<Icon aria-hidden={false} aria-label="Warning" />);

    expect(recipeElement(hidden.container, "icon").getAttribute("aria-hidden")).toBe("true");
    expect(recipeElement(labelled.container, "icon").getAttribute("aria-hidden")).toBe("false");
  });

  it("draws the class of the size a caller picks", () => {
    const { container } = render(<Icon size="lg" />);

    expect(recipeClasses(container, "icon")).toContain(variantClass("icon", "size", "lg"));
  });

  it("draws the class of the tone a caller picks", () => {
    const { container } = render(<Icon tone="error" />);

    expect(recipeClasses(container, "icon")).toContain(variantClass("icon", "tone", "error"));
  });

  it("draws the class of the motion a caller picks", () => {
    const { container } = render(<Icon motion="spin" />);

    expect(recipeClasses(container, "icon")).toContain(variantClass("icon", "motion", "spin"));
  });

  it("draws the mirrored class where a caller asks for one", () => {
    const { container } = render(<Icon mirrored />);

    expect(recipeClasses(container, "icon")).toContain(variantClass("icon", "mirrored", true));
  });

  it("draws the element as names", () => {
    const { container } = render(<Icon as="span" />);

    expect(recipeElement(container, "icon").tagName).toBe("SPAN");
  });
});
