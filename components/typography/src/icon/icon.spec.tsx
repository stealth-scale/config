import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Icon } from "#icon/icon.ts";
import { recipe } from "#icon/recipe.ts";

describe("Icon", () => {
  it("conforms as an svg element", () => {
    expect(violations(Icon, { as: true, children: true, element: "SVG" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule hidden from assistive technology or labelled", async () => {
    await expect(accessibilityViolations(Icon)).resolves.toStrictEqual([]);
    await expect(
      accessibilityViolations(Icon, { props: { "aria-hidden": false, "aria-label": "Warning" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(boundViolations(recipe, (props) => render(<Icon {...props} />).container)).toStrictEqual(
      [],
    );
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

  it("draws the element as names", () => {
    const { container } = render(<Icon as="span" />);

    expect(recipeElement(container, "icon").tagName).toBe("SPAN");
  });
});
