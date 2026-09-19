import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fielded } from "#field/field.fixtures.tsx";
import { useField } from "#field/state.ts";

/**
 * Reads the field's state back and draws what it found, so a case can assert on it.
 *
 * @returns The state as text.
 */
function Reader(): string {
  const { disabled, invalid, readOnly, required } = useField();

  return [disabled, invalid, readOnly, required].map(String).join(" ");
}

describe("state", () => {
  it("hands every part what the field knows about itself", () => {
    render(fielded(<Reader />, { disabled: true, invalid: true, readOnly: true, required: true }));

    expect(screen.getByText("true true true true")).toBeDefined();
  });

  it("reads every state as false where a caller states none", () => {
    render(fielded(<Reader />));

    expect(screen.getByText("false false false false")).toBeDefined();
  });

  it("refuses a part drawn outside a field", () => {
    expect(() => render(<Reader />)).toThrow(/Field/u);
  });
});
