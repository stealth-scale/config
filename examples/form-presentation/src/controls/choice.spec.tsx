import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Choice } from "#controls/choice.tsx";
import { Harness } from "#controls/harness.fixtures.tsx";

describe("Choice", () => {
  it("draws a select over the string choices of the enum", () => {
    const { getAllByRole } = render(
      <Harness draw={Choice} schema={{ enum: ["a", "b", 3], type: "string" }} />,
    );

    expect(getAllByRole("option").map((option) => option.textContent)).toStrictEqual([
      "Choose",
      "a",
      "b",
    ]);
  });
});
