import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Header } from "#page/header.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Header", () => {
  it("draws a header inside the column it needs above it", () => {
    const { container } = render(paged(<Header>April</Header>));

    expect(slotElement(container, "page", "header").tagName).toBe("HEADER");
  });

  it("stays put where a caller asks", () => {
    const { container } = render(paged(<Header sticky>April</Header>));

    expect(slotElement(container, "page", "header").dataset["sticky"]).toBe("");
  });

  it("moves with the page where no caller asks", () => {
    const { container } = render(paged(<Header>April</Header>));

    expect(slotElement(container, "page", "header").dataset["sticky"]).toBeUndefined();
  });
});
