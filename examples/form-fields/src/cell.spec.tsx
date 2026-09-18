import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Cell } from "#cell.tsx";

describe("Cell", () => {
  it("draws the field as it is where it takes one column", () => {
    const { container } = render(
      <Cell>
        <input />
      </Cell>,
    );

    expect(container.firstElementChild?.tagName).toBe("INPUT");
  });

  it("wraps the field in an element spanning the columns it takes", () => {
    const { container } = render(
      <Cell span={2}>
        <input />
      </Cell>,
    );

    expect(container.querySelector(".span-2 input")).not.toBeNull();
  });
});
