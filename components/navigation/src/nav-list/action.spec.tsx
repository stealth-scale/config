import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Action } from "#nav-list/action.ts";
import { listed } from "#nav-list/nav-list.fixtures.tsx";

describe("Action", () => {
  it("draws a span inside the list it needs above it", () => {
    const { container } = render(listed(<Action>mark</Action>));

    expect(slotElement(container, "nav-list", "action").tagName).toBe("SPAN");
  });

  it("leaves the control it holds reachable on its own", () => {
    render(
      listed(
        <Action>
          <button type="button">Pin Invoices</button>
        </Action>,
      ),
    );

    expect(screen.getByRole("button", { name: "Pin Invoices" })).toBeTruthy();
  });
});
