import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Harness } from "#controls/harness.fixtures.tsx";
import { PlainText } from "#controls/plain-text.tsx";

describe("PlainText", () => {
  it("draws a text box labelled with the schema's title", () => {
    const { getByLabelText } = render(
      <Harness draw={PlainText} schema={{ title: "A note", type: "string" }} />,
    );

    expect(getByLabelText("A note").getAttribute("type")).toBe("text");
  });

  it("labels the box with the path where the schema has no title", () => {
    const { getByLabelText } = render(<Harness draw={PlainText} schema={{ type: "string" }} />);

    expect(getByLabelText("Note").getAttribute("type")).toBe("text");
  });
});
