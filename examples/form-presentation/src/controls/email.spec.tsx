import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Email } from "#controls/email.tsx";
import { Harness } from "#controls/harness.fixtures.tsx";

describe("Email", () => {
  it("draws an email box", () => {
    const { getByLabelText } = render(<Harness draw={Email} schema={{ type: "string" }} />);

    expect(getByLabelText("Note").getAttribute("type")).toBe("email");
  });
});
