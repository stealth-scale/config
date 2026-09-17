import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotVariantClass } from "@stealthscale/testing-theme";

import { Cards } from "#cards.tsx";

describe("Cards", () => {
  it("heads the section with the cards", () => {
    const { getByRole } = render(<Cards />);

    expect(getByRole("heading", { name: "Cards" })).toBeDefined();
  });

  it("draws four cards, each an article with a header, a content band and a footer", () => {
    const { getAllByRole } = render(<Cards />);
    const cards = getAllByRole("article");

    expect(cards).toHaveLength(4);
    expect(cards.every((card) => card.querySelector("header") !== null)).toBe(true);
    expect(cards.every((card) => card.querySelector("footer") !== null)).toBe(true);
  });

  it("draws each card in the look and the size it names, down to its bands", () => {
    const { getAllByRole } = render(<Cards />);
    const [, outline, subtle] = getAllByRole("article");

    expect(outline?.className).toContain(slotVariantClass("card", "root", "variant", "outline"));
    expect(outline?.querySelector("header")?.className).toContain(
      slotVariantClass("card", "header", "size", "sm"),
    );
    expect(subtle?.className).toContain(slotVariantClass("card", "root", "variant", "subtle"));
    expect(subtle?.querySelector("footer")?.className).not.toContain(
      slotVariantClass("card", "footer", "variant", "subtle"),
    );
  });

  it("dresses the last card in forge from the box above it", () => {
    const { getAllByRole } = render(<Cards />);
    const last = getAllByRole("article")[3];

    expect(last?.dataset["theme"]).toBeUndefined();
    expect(last?.parentElement?.dataset["theme"]).toBe("forge");
  });

  it("draws the same cards when it renders again", () => {
    const { getAllByRole, rerender } = render(<Cards />);

    rerender(<Cards />);

    expect(getAllByRole("article")).toHaveLength(4);
  });
});
