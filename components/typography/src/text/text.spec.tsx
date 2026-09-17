import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { recipeClasses, recipeElement, variantClass } from "@stealthscale/testing-theme";

import { Text } from "#text/text.ts";

describe("Text", () => {
  it("conforms as a paragraph element", () => {
    expect(violations(Text, { as: true, children: true, element: "P" })).toStrictEqual([]);
  });

  it("draws the recipe's class and the class of the default size", () => {
    const { container } = render(<Text>Words</Text>);

    expect(recipeClasses(container, "text")).toStrictEqual([
      "text",
      variantClass("text", "size", "md"),
    ]);
  });

  it("draws the class of the size a caller picks", () => {
    const { container } = render(<Text size="lg">Words</Text>);

    expect(recipeClasses(container, "text")).toContain(variantClass("text", "size", "lg"));
  });

  it("draws the class of the tone a caller picks", () => {
    const { container } = render(<Text tone="muted">Words</Text>);

    expect(recipeClasses(container, "text")).toContain(variantClass("text", "tone", "muted"));
  });

  it("draws the class of the weight a caller picks", () => {
    const { container } = render(<Text weight="semibold">Words</Text>);

    expect(recipeClasses(container, "text")).toContain(variantClass("text", "weight", "semibold"));
  });

  it("draws the class of the alignment a caller picks", () => {
    const { container } = render(<Text align="center">Words</Text>);

    expect(recipeClasses(container, "text")).toContain(variantClass("text", "align", "center"));
  });

  it("draws the truncate class where a caller asks for one line", () => {
    const { container } = render(<Text truncate>Words</Text>);

    expect(recipeClasses(container, "text")).toContain(variantClass("text", "truncate", true));
  });

  it("draws the element as names", () => {
    const { container } = render(<Text as="span">Words</Text>);

    expect(recipeElement(container, "text").tagName).toBe("SPAN");
  });
});
