import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotClass, slotClasses, slotElement, slotVariantClass } from "@stealthscale/testing-theme";

import { Card } from "#index.ts";

/**
 * Lists the classes one band carries in one look and one size.
 */
function bandClasses(slot: string, size: string, variant: string): readonly string[] {
  return [
    slotClass("card", slot),
    slotVariantClass("card", slot, "size", size),
    slotVariantClass("card", slot, "variant", variant),
  ];
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

    expect(slotElement(container, "root").tagName).toBe("ARTICLE");
    expect(slotElement(container, "header").tagName).toBe("HEADER");
    expect(slotElement(container, "content").tagName).toBe("DIV");
    expect(slotElement(container, "footer").tagName).toBe("FOOTER");
  });
});
