import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useBoundField } from "#field-like.ts";
import { useAppForm } from "#hook.ts";

/**
 * Prints the four members a component reads, and offers a button for each of the two it calls.
 */
function Probe(): ReactElement {
  const field = useBoundField<string>();
  const { errors, isTouched } = field.state.meta;

  return (
    <div>
      <output>{`${field.name}:${field.state.value}:${String(isTouched)}:${errors.length}`}</output>
      <button
        onClick={() => {
          field.handleChange("Ann");
        }}
        type="button"
      >
        change
      </button>
      <button onClick={field.handleBlur} type="button">
        blur
      </button>
    </div>
  );
}

/**
 * Binds the probe to a field of a form.
 */
function Harness(): ReactElement {
  const form = useAppForm({ defaultValues: { name: "Roy" } });

  return (
    <form.AppForm>
      <form.AppField name="name">{() => <Probe />}</form.AppField>
    </form.AppForm>
  );
}

describe("useBoundField", () => {
  it("reads the name and the value and the meta of the field in scope", () => {
    const { getByRole } = render(<Harness />);

    expect(getByRole("status").textContent).toBe("name:Roy:false:0");
  });

  it("sets the value and marks the field touched through handleChange", () => {
    const { getByRole } = render(<Harness />);

    fireEvent.click(getByRole("button", { name: "change" }));

    expect(getByRole("status").textContent).toBe("name:Ann:true:0");
  });

  it("marks the field touched through handleBlur", () => {
    const { getByRole } = render(<Harness />);

    fireEvent.click(getByRole("button", { name: "blur" }));

    expect(getByRole("status").textContent).toBe("name:Roy:true:0");
  });
});
