import { type ReactElement } from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useSchemaForm } from "#hooks.fixtures.ts";
import { RootErrors } from "#root-errors.tsx";
import { type Schema } from "#schema.ts";
import { translateFrom } from "#translate.ts";

const guarded: Schema = {
  not: { properties: { name: { const: "x" } }, required: ["name"] },
  properties: { name: { type: "string" } },
  type: "object",
  "x-form": { id: "guarded" },
};

/**
 * Builds a form the root of whose schema refuses the value, and draws the region by itself.
 */
function Page(): ReactElement {
  const form = useSchemaForm({
    schema: guarded,
    translate: translateFrom({ "guarded.errors.not": "That name is taken" }),
    validators: { onSubmit: () => "That name is taken" },
    values: { name: "x" },
  });

  return (
    <form.AppForm>
      <form.Form>
        <RootErrors />
        <form.Submit />
      </form.Form>
    </form.AppForm>
  );
}

describe("RootErrors", () => {
  it("draws an empty alert region carrying the form's errors id before anything is refused", () => {
    const { container, getByRole } = render(<Page />);
    const region = getByRole("alert");

    expect(region.id).toBe(`${container.querySelector("form")?.id ?? ""}-errors`);
    expect(region.textContent).toBe("");
  });

  it("reads the root issues in words, each once, after a refused submit", async () => {
    const { getByRole } = render(<Page />);

    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(getByRole("alert").textContent).toBe("That name is taken");
    });
    expect(getByRole("alert").querySelectorAll("p")).toHaveLength(1);
  });

  it("moves focus to the region when no field accounts for the refusal", async () => {
    const { getByRole } = render(<Page />);

    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(document.activeElement).toBe(getByRole("alert"));
    });
  });
});
