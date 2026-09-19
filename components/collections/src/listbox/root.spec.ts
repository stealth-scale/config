import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#listbox/listbox.fixtures.tsx";
import { recipe } from "#listbox/recipe.ts";
import { type RootProps } from "#listbox/root.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding a label and a list of rows", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props: Omit<RootProps, "collection">) => render(composed(props)).container,
        { slot: "root" },
      ),
    ).toStrictEqual([]);
  });

  it("draws a frame carrying no role of its own", () => {
    const { container } = render(composed());

    expect(slotElement(container, "listbox", "root").tagName).toBe("DIV");
    expect(slotElement(container, "listbox", "root").getAttribute("role")).toBeNull();
  });

  it("names the list from the label beside it", () => {
    render(composed());

    expect(screen.getByRole("listbox", { name: "Places" })).toBeTruthy();
  });

  it("offers one option per row of the collection", () => {
    render(composed());

    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("marks the row a caller says is chosen", () => {
    render(composed({ value: ["reports"] }));

    expect(screen.getByRole("option", { name: "Reports" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });
});
