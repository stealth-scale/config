import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Harness } from "#controls/harness.fixtures.tsx";
import { Textarea } from "#controls/textarea.tsx";

describe("Textarea", () => {
  it("draws a multi-line box bound to the field", () => {
    const { getByLabelText } = render(<Harness draw={Textarea} schema={{ type: "string" }} />);

    fireEvent.change(getByLabelText("Note"), { target: { value: "A few lines" } });

    expect(getByLabelText("Note").tagName).toBe("TEXTAREA");
    expect(getByLabelText("Note")).toHaveProperty("value", "A few lines");
  });
});
