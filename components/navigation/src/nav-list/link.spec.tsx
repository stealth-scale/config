import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Link } from "#nav-list/link.ts";
import { listed } from "#nav-list/nav-list.fixtures.tsx";

describe("Link", () => {
  it("draws an anchor inside the list it needs above it", () => {
    const { container } = render(listed(<Link href="/">Overview</Link>));

    expect(slotElement(container, "nav-list", "link").tagName).toBe("A");
  });

  it("goes where the href names", () => {
    render(listed(<Link href="/invoices">Invoices</Link>));

    expect(screen.getByRole("link", { name: "Invoices" }).getAttribute("href")).toBe("/invoices");
  });

  it("says which row names the page being read", () => {
    render(
      listed(
        <Link aria-current="page" href="/">
          Overview
        </Link>,
      ),
    );

    expect(screen.getByRole("link").getAttribute("aria-current")).toBe("page");
  });

  it("draws the element as names, for a row that acts rather than goes", () => {
    const { container } = render(listed(<Link as="button">Sign out</Link>));

    expect(slotElement(container, "nav-list", "link").tagName).toBe("BUTTON");
  });
});
