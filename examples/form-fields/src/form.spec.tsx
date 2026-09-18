import { type ReactElement } from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAppForm } from "#hook.ts";

const submitted = vi.fn();

/**
 * Builds a form over one name that reports what it submits.
 */
function Harness(): ReactElement {
  const form = useAppForm({
    defaultValues: { name: "Roy" },
    onSubmit: ({ value }) => {
      submitted(value);
    },
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.Submit />
      </form.Form>
    </form.AppForm>
  );
}

describe("Form", () => {
  it("submits the form's values when the element is submitted", async () => {
    const { getByRole } = render(<Harness />);

    fireEvent.submit(getByRole("button"));

    await waitFor(() => {
      expect(submitted).toHaveBeenCalledWith({ name: "Roy" });
    });
  });

  it("turns the browser's own validation off", () => {
    const { container } = render(<Harness />);

    expect(container.querySelector("form")).toHaveProperty("noValidate", true);
  });
});
