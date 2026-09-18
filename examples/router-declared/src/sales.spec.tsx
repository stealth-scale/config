import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Sales } from "#sales.tsx";

describe("Sales", () => {
  it("names itself for a screen reader", () => {
    render(<Sales>{"a page"}</Sales>);

    expect(screen.getByRole("region", { name: "Sales" })).toBeDefined();
  });

  it("draws the page below it inside the frame", () => {
    render(<Sales>{"a page"}</Sales>);

    expect(screen.getByRole("region", { name: "Sales" }).textContent).toContain("a page");
  });
});
