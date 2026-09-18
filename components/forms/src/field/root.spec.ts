import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#field/field.fixtures.tsx";
import { recipe } from "#field/recipe.ts";
import { Root, type RootProps } from "#field/root.tsx";

describe("Root", () => {
  it("conforms as a div", () => {
    expect(violations(Root, { as: true, children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding every part", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("carries no role because the control inside it keeps its own", () => {
    const { container } = render(composed());

    expect(slotElement(container, "field", "root").hasAttribute("role")).toBe(false);
  });

  it("marks itself wrong so every part below reads one state", () => {
    const { container } = render(composed({ invalid: true }));

    expect(slotElement(container, "field", "root").dataset["invalid"]).toBe("true");
  });

  it("states one identifier the parts derive the rest from", () => {
    render(composed({ id: "email" }));

    expect(screen.getByRole("textbox").getAttribute("id")).toBe("email");
  });

  it("generates an identifier where a caller states none", () => {
    render(composed());

    expect(screen.getByRole("textbox").getAttribute("id")).toBeTruthy();
  });
});
