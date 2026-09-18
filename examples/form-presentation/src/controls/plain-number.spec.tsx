import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Harness } from "#controls/harness.fixtures.tsx";
import { PlainNumber } from "#controls/plain-number.tsx";

describe("PlainNumber", () => {
  it("draws a number box", () => {
    const { getByLabelText } = render(<Harness draw={PlainNumber} schema={{ type: "number" }} />);

    expect(getByLabelText("Amount").getAttribute("type")).toBe("number");
  });
});
