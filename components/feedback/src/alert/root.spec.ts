import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#alert/alert.fixtures.tsx";
import { recipe } from "#alert/recipe.ts";
import { Root, type RootProps } from "#alert/root.tsx";

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

  it("announces politely through the status role when nothing is asked for", () => {
    render(composed());

    expect(screen.getByRole("status")).toBeDefined();
  });

  it("interrupts through the alert role where a caller asks", () => {
    render(composed({ live: "assertive" }));

    expect(screen.getByRole("alert")).toBeDefined();
  });

  it("carries no role where a caller turns the announcement off", () => {
    const { container } = render(composed({ live: "off" }));

    expect(slotElement(container, "alert", "root").hasAttribute("role")).toBe(false);
  });

  it("keeps a role a caller states over the one its loudness asks for", () => {
    const { container } = render(composed({ live: "assertive", role: "note" }));

    expect(slotElement(container, "alert", "root").getAttribute("role")).toBe("note");
  });

  it("draws the element as names", () => {
    const { container } = render(composed({ as: "section" }));

    expect(slotElement(container, "alert", "root").tagName).toBe("SECTION");
  });
});
