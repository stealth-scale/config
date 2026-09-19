import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#fieldset/fieldset.fixtures.tsx";
import { recipe } from "#fieldset/recipe.ts";
import { Root, type RootProps } from "#fieldset/root.tsx";

describe("Root", () => {
  it("conforms as a fieldset", () => {
    expect(violations(Root, { as: true, children: true, element: "FIELDSET" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule holding a legend and a field", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("is read as a group named by its legend", () => {
    render(composed());

    expect(screen.getByRole("group", { name: "Delivery" })).toBeDefined();
  });

  it("takes every control inside it out of reach through the element's own attribute", () => {
    const { container } = render(composed({ disabled: true }));

    expect(slotElement(container, "fieldset", "root").hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("textbox").hasAttribute("disabled")).toBe(true);
  });

  it("marks itself wrong off the attribute a screen reader reads too", () => {
    const { container } = render(composed({ invalid: true }));
    const root = slotElement(container, "fieldset", "root");

    expect(root.dataset["invalid"]).toBe("true");
    expect(root.getAttribute("aria-invalid")).toBe("true");
  });

  it("is described by both of its texts", () => {
    const { container } = render(composed({ id: "delivery" }));

    expect(slotElement(container, "fieldset", "root").getAttribute("aria-describedby")).toBe(
      "delivery-helper delivery-error",
    );
  });

  it("clears the minimum width a fieldset defaults to", () => {
    expect(recipe.base?.["root"]).toMatchObject({ minInlineSize: "0" });
  });
});
