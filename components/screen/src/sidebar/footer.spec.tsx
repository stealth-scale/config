import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Footer } from "#sidebar/footer.ts";
import { aside } from "#sidebar/sidebar.fixtures.tsx";

describe("Footer", () => {
  it("draws a band inside the column it needs above it", () => {
    const { container } = render(aside(<Footer>Account</Footer>));

    expect(slotElement(container, "sidebar", "footer").tagName).toBe("DIV");
  });

  it("holds whatever a person reaches for last", () => {
    const { container } = render(aside(<Footer>Account</Footer>));

    expect(slotElement(container, "sidebar", "footer").textContent).toBe("Account");
  });
});
