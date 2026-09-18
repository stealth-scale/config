import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { boundViolations, recipeElement } from "@stealthscale/testing-theme";

import { Link } from "#link/link.ts";
import { recipe } from "#link/recipe.ts";

describe("Link", () => {
  it("conforms as an anchor element", () => {
    expect(violations(Link, { as: true, children: true, element: "A" })).toStrictEqual([]);
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Link, { props: { children: "Read on", href: "#read" } }),
    ).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props) => render(<Link {...props}>Read on</Link>).container),
    ).toStrictEqual([]);
  });

  it("keeps the address a caller states", () => {
    const { container } = render(<Link href="/invoices">Invoices</Link>);

    expect(recipeElement(container, "link").getAttribute("href")).toBe("/invoices");
  });

  it("draws the element as names so a router's own link keeps its routing", () => {
    const { container } = render(<Link as="button">Read on</Link>);

    expect(recipeElement(container, "link").tagName).toBe("BUTTON");
  });
});
