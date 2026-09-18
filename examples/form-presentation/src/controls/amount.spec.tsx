import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Amount } from "#controls/amount.tsx";
import { Harness } from "#controls/harness.fixtures.tsx";

describe("Amount", () => {
  it("draws the currency the options name beside the box", () => {
    const { getByLabelText, getByText } = render(
      <Harness
        draw={Amount}
        presentation={{ options: { currency: "EUR" } }}
        schema={{ type: "number" }}
      />,
    );

    expect(getByLabelText("Amount").getAttribute("type")).toBe("number");
    expect(getByText("EUR").tagName).toBe("SPAN");
  });

  it("draws nothing beside the box where the currency is not a string", () => {
    const { container } = render(
      <Harness
        draw={Amount}
        presentation={{ options: { currency: 3 } }}
        schema={{ type: "number" }}
      />,
    );

    expect(container.querySelector("span")?.textContent).toBe("");
  });
});
