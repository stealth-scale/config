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

import { Card } from "#index.ts";

/**
 * Lists the classes one band carries in one look and one size, sorted as the reader lists them.
 * The root takes the size and the look, the header the size, and the other bands neither, because
 * the recipe styles them through no variant.
 */
function bandClasses(slot: string, size: string, variant: string): readonly string[] {
  const styled: Readonly<Record<string, readonly string[]>> = {
    header: [slotVariantClass("card", slot, "size", size)],
    root: [
      slotVariantClass("card", slot, "size", size),
      slotVariantClass("card", slot, "variant", variant),
    ],
  };

  return [slotClass("card", slot), ...(styled[slot] ?? [])].toSorted();
}

describe("Card", () => {
  it("conforms as an article element", () => {
    expect(violations(Card.Root, { children: true, element: "ARTICLE" })).toStrictEqual([]);
  });

  it("draws each band's slot class and the classes of the default variants", () => {
    const { container } = render(
      <Card.Root>
        <Card.Header>Title</Card.Header>
        <Card.Content>Body</Card.Content>
        <Card.Footer>Actions</Card.Footer>
      </Card.Root>,
    );

    expect(slotClasses(container, "root")).toStrictEqual(bandClasses("root", "md", "elevated"));
    expect(slotClasses(container, "header")).toStrictEqual(bandClasses("header", "md", "elevated"));
    expect(slotClasses(container, "content")).toStrictEqual(
      bandClasses("content", "md", "elevated"),
    );
    expect(slotClasses(container, "footer")).toStrictEqual(bandClasses("footer", "md", "elevated"));
  });

  it("hands the look and the size the root was given to every band", () => {
    const { container } = render(
      <Card.Root size="lg" variant="subtle">
        <Card.Header>Title</Card.Header>
        <Card.Footer>Actions</Card.Footer>
      </Card.Root>,
    );

    expect(slotClasses(container, "header")).toStrictEqual(bandClasses("header", "lg", "subtle"));
    expect(slotClasses(container, "footer")).toStrictEqual(bandClasses("footer", "lg", "subtle"));
  });

  it("renders the elements each part is bound to", () => {
    const { container } = render(
      <Card.Root>
        <Card.Header>Title</Card.Header>
        <Card.Content>Body</Card.Content>
        <Card.Footer>Actions</Card.Footer>
      </Card.Root>,
    );

    expect(recipeElement(container, "card")).toBe(slotElement(container, "root"));
    expect(slotElement(container, "root").tagName).toBe("ARTICLE");
    expect(slotElement(container, "header").tagName).toBe("HEADER");
    expect(slotElement(container, "content").tagName).toBe("DIV");
    expect(slotElement(container, "footer").tagName).toBe("FOOTER");
  });
});
