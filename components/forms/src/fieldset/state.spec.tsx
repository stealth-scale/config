import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import { composed, grouped } from "#fieldset/fieldset.fixtures.tsx";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Reads the group back and draws what it found, so a case can assert on it.
 *
 * @returns Whether the group is disabled, as text.
 */
function Reader(): string {
  return String(useFieldset().disabled);
}

describe("state", () => {
  it("reads nothing disabled outside a group", () => {
    render(<Reader />);

    expect(screen.getByText("false")).toBeDefined();
  });

  it("hands the group's state down", () => {
    render(grouped(<Reader />, { disabled: true }));

    expect(screen.getByText("true")).toBeDefined();
  });

  it("draws a field inside a disabled group as unreachable", () => {
    const { container } = render(composed({ disabled: true }));

    expect(slotElement(container, "field", "label").dataset["disabled"]).toBe("true");
  });

  it("keeps a field's own state over the group's", () => {
    const { container } = render(
      grouped(
        <Field.Root disabled={false}>
          <Field.Label>Address</Field.Label>
          <Field.Control />
        </Field.Root>,
        { disabled: true },
      ),
    );

    expect(slotElement(container, "field", "label").dataset["disabled"]).toBeUndefined();
  });
});
