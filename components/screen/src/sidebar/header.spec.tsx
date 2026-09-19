import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Header } from "#sidebar/header.ts";
import { aside } from "#sidebar/sidebar.fixtures.tsx";

describe("Header", () => {
  it("draws a band inside the column it needs above it", () => {
    const { container } = render(aside(<Header>Acme</Header>));

    expect(slotElement(container, "sidebar", "header").tagName).toBe("DIV");
  });

  it("stays where it was drawn while the destinations under it scroll", () => {
    const { container } = render(aside(<Header>Acme</Header>));

    expect(slotElement(container, "sidebar", "header").parentElement).toBe(
      slotElement(container, "sidebar", "root"),
    );
  });
});
