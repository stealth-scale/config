import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import {
  boundViolations,
  slotClass,
  slotClasses,
  slotElement,
  variantClass,
} from "@stealthscale/testing-theme";

import { Root as PageRoot } from "#page/root.tsx";
import { Body } from "#section/body.ts";
import { recipe } from "#section/recipe.ts";
import { type RootProps } from "#section/root.tsx";
import { blocked, composed } from "#section/section.fixtures.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding every band it draws", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("draws a section element", () => {
    const { container } = render(composed());

    expect(slotElement(container, "section", "root").tagName).toBe("SECTION");
  });

  it("becomes a landmark once the title names it", () => {
    render(composed());

    expect(screen.getByRole("region", { name: "Billing" })).toBeTruthy();
  });

  it("carries no name while no title is drawn", () => {
    const { container } = render(blocked(<Body>The plan</Body>));

    expect(screen.queryByRole("region", { name: /./u })).toBeNull();
    expect(slotElement(container, "section", "root").getAttribute("aria-labelledby")).toBeTruthy();
  });

  it("takes its size from the page it stands in", () => {
    const { container } = render(<PageRoot size="lg">{composed()}</PageRoot>);

    expect(slotClasses(container, "section", "title")).toContain(
      variantClass(slotClass("section", "title"), "size", "lg"),
    );
  });

  it("keeps its own size where it states one inside a page", () => {
    const { container } = render(<PageRoot size="lg">{composed({ size: "sm" })}</PageRoot>);

    expect(slotClasses(container, "section", "title")).toContain(
      variantClass(slotClass("section", "title"), "size", "sm"),
    );
  });

  it("reports no narrowness in a document that measures nothing", () => {
    const { container } = render(composed());

    expect(slotElement(container, "section", "root").dataset["narrow"]).toBeUndefined();
  });
});
