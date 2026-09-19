import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { paged } from "#page/page.fixtures.tsx";
import { Trail } from "#page/trail.ts";

describe("Trail", () => {
  it("draws an anchor inside the column it needs above it", () => {
    const { container } = render(paged(<Trail href="/invoices">Invoices</Trail>));

    expect(slotElement(container, "page", "trail").tagName).toBe("A");
  });

  it("goes where the href names", () => {
    render(paged(<Trail href="/invoices">Invoices</Trail>));

    expect(screen.getByRole("link", { name: "Invoices" }).getAttribute("href")).toBe("/invoices");
  });
});
