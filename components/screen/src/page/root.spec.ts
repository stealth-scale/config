import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#page/page.fixtures.tsx";
import { recipe } from "#page/recipe.ts";
import { type RootProps } from "#page/root.tsx";

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

  it("draws a column", () => {
    const { container } = render(composed());

    expect(slotElement(container, "page", "root").tagName).toBe("DIV");
  });

  it("claims no landmark of its own", () => {
    render(composed());

    expect(screen.queryByRole("main")).toBeNull();
  });

  it("reports no fold in a document that measures nothing", () => {
    const { container } = render(composed());

    expect(slotElement(container, "page", "root").dataset["narrow"]).toBeUndefined();
  });
});
