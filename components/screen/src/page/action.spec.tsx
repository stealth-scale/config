import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Action } from "#page/action.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Action", () => {
  it("draws a button inside the column it needs above it", () => {
    render(paged(<Action>Download</Action>));

    expect(screen.getByRole("button", { name: "Download" })).toBeTruthy();
  });

  it("says it submits nothing, so a control inside a form does not", () => {
    render(paged(<Action>Download</Action>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("keeps its words at every width where nothing says otherwise", () => {
    const { container } = render(paged(<Action>Download</Action>));

    expect(slotElement(container, "page", "action").dataset["priority"]).toBe("primary");
  });

  it("gives way in the order the priority states", () => {
    const { container } = render(paged(<Action priority="tertiary">Archive</Action>));

    expect(slotElement(container, "page", "action").dataset["priority"]).toBe("tertiary");
  });

  it("lets each control in a row say for itself", () => {
    render(
      paged(
        <>
          <Action>Download</Action>
          <Action priority="secondary">Print</Action>
        </>,
      ),
    );

    expect(screen.getAllByRole("button").map((each) => each.dataset["priority"])).toStrictEqual([
      "primary",
      "secondary",
    ]);
  });
});
