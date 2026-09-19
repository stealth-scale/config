import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Actions } from "#page/actions.ts";
import { paged } from "#page/page.fixtures.tsx";

describe("Actions", () => {
  it("draws a div inside the column it needs above it", () => {
    const { container } = render(paged(<Actions>controls</Actions>));

    expect(slotElement(container, "page", "actions").tagName).toBe("DIV");
  });

  it("leaves the controls it holds reachable", () => {
    render(
      paged(
        <Actions>
          <button type="button">Download</button>
        </Actions>,
      ),
    );

    expect(screen.getByRole("button", { name: "Download" })).toBeTruthy();
  });
});
