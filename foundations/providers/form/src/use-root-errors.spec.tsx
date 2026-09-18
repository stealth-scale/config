import { type ReactElement } from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSchemaForm } from "#hooks.fixtures.ts";
import { type Schema } from "#schema.ts";
import { rootErrorsOf, useRootErrors } from "#use-root-errors.ts";

const guarded: Schema = {
  not: { properties: { name: { const: "x" } }, required: ["name"] },
  properties: { name: { type: "string" } },
  type: "object",
};

/**
 * Writes the root errors of the form in scope and counts its renders.
 */
function Probe({ rendered }: { readonly rendered: () => void }): ReactElement {
  rendered();

  return <output>{JSON.stringify(useRootErrors())}</output>;
}

/**
 * Builds a form the root of whose schema refuses the value and whose validator refuses it again
 * with an object built anew on every attempt, with the probe, a submit, and a count of the submit
 * attempts.
 */
function Page({ rendered }: { readonly rendered: () => void }): ReactElement {
  const form = useSchemaForm({
    schema: guarded,
    validators: { onSubmit: () => ({ keyword: "taken" }) },
    values: { name: "x" },
  });

  return (
    <form.AppForm>
      <form.Form>
        <Probe rendered={rendered} />
        <form.Submit />
        <form.Subscribe selector={(state) => state.submissionAttempts}>
          {(attempts) => <p>{String(attempts)} attempts</p>}
        </form.Subscribe>
      </form.Form>
    </form.AppForm>
  );
}

describe("rootErrorsOf", () => {
  it("lists the issues a schema reports at the root", () => {
    const issue = { keyword: "not" };

    expect(rootErrorsOf({ onDynamic: { "": [issue], name: [{ keyword: "type" }] } })).toStrictEqual(
      [issue],
    );
  });

  it("lists a value a form validator returned for the whole form", () => {
    expect(rootErrorsOf({ onSubmit: "refused" })).toStrictEqual(["refused"]);
  });

  it("lists nothing for a slot that reports by field alone, or nothing at all", () => {
    const errorMap = { onChange: undefined, onDynamic: { name: ["x"] }, onSubmit: null };

    expect(rootErrorsOf(errorMap)).toStrictEqual([]);
  });
});

describe("useRootErrors", () => {
  it("reads the root issues of the form in scope once it validates", async () => {
    const rendered = vi.fn<() => void>();
    const { getByRole } = render(<Page rendered={rendered} />);

    expect(getByRole("status").textContent).toBe("[]");

    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(getByRole("status").textContent).toContain('"keyword":"not"');
    });
  });

  it("leaves the reader alone while the same errors are reported anew", async () => {
    const rendered = vi.fn<() => void>();
    const { getByRole, getByText } = render(<Page rendered={rendered} />);

    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(getByRole("status").textContent).toContain('"keyword":"not"');
    });

    const renders = rendered.mock.calls.length;

    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(getByText("2 attempts")).toBeDefined();
    });
    expect(rendered).toHaveBeenCalledTimes(renders);
  });
});
