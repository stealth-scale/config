import { type ReactElement } from "react";

import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { memoryStore, type SettingStore } from "@stealthscale/settings";

import { draftKey, schemaHash, writeDraft } from "#draft.ts";
import { useSchemaForm } from "#hooks.fixtures.ts";
import { type Steps } from "#presentation.ts";
import { type Schema } from "#schema.ts";
import { Stepper } from "#stepper.tsx";
import { translateFrom } from "#translate.ts";

const profile: Schema = {
  properties: { bio: { type: "string" }, name: { minLength: 2, type: "string" } },
  required: ["name"],
  type: "object",
};

const wizard: Steps = {
  of: [
    { name: "who", of: ["name"] },
    { label: "profile.about", name: "about", of: ["bio"] },
  ],
};

const words = translateFrom({ "profile.about": "About you" });
const KEY = draftKey("docs", "profile");

/**
 * Builds a form from the schema over the store given and draws it in the steps given.
 */
function Page({
  steps = wizard,
  store = memoryStore(),
}: {
  readonly steps?: Steps | undefined;
  readonly store?: SettingStore | undefined;
}): ReactElement {
  const form = useSchemaForm({
    draft: { app: "docs", store },
    id: "profile",
    schema: profile,
    translate: words,
  });

  return (
    <form.AppForm>
      <form.Form>
        <Stepper resolved={profile} steps={steps} />
      </form.Form>
    </form.AppForm>
  );
}

describe("Stepper", () => {
  it("opens on the first step with the derived and the stated labels", () => {
    const { getByLabelText, getByRole } = render(<Page />);

    expect(getByRole("heading", { level: 2 }).textContent).toBe("Who");
    expect(getByLabelText("Name")).toBeDefined();
  });

  it("opens on the step the draft was written on", () => {
    const store = memoryStore();

    writeDraft(store, KEY, { hash: schemaHash(profile), step: "about", values: { bio: "Hi" } });

    const { getByLabelText, getByRole } = render(<Page store={store} />);

    expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
    expect(getByLabelText("Bio")).toHaveProperty("value", "Hi");
  });

  it("moves to the step of a draft that arrives after the first render", () => {
    const store = memoryStore();
    const { getByRole } = render(<Page store={store} />);

    act(() => {
      writeDraft(store, KEY, { hash: schemaHash(profile), step: "about", values: {} });
    });

    expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
  });

  it("keeps the step a person chose when a draft arrives after it", async () => {
    const store = memoryStore();
    const { getByRole } = render(<Page steps={{ ...wizard, kind: "tabs" }} store={store} />);

    fireEvent.click(getByRole("button", { name: "About you" }));

    await waitFor(() => {
      expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
    });

    act(() => {
      writeDraft(store, KEY, { hash: schemaHash(profile), step: "who", values: {} });
    });

    expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
  });

  it("refuses to move forward while a field of the step is refused", async () => {
    const { getByLabelText, getByRole } = render(<Page />);

    fireEvent.click(getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(getByRole("alert")).toBeDefined();
    });
    expect(getByRole("heading", { level: 2 }).textContent).toBe("Who");
    expect(document.activeElement).toBe(getByLabelText("Name"));
  });

  it("moves forward once the step passes and writes the step into the draft", async () => {
    const store = memoryStore();
    const { getByLabelText, getByRole } = render(<Page store={store} />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "Roy" } });
    fireEvent.click(getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
    });
    expect(JSON.parse(store.read(KEY) ?? "null")).toStrictEqual({
      hash: schemaHash(profile),
      step: "about",
      values: { bio: "", name: "Roy" },
    });
  });

  it("moves back without validating", async () => {
    const store = memoryStore();

    writeDraft(store, KEY, { hash: schemaHash(profile), step: "about", values: {} });

    const { getByRole } = render(<Page store={store} />);

    fireEvent.click(getByRole("button", { name: "Back" }));

    await waitFor(() => {
      expect(getByRole("heading", { level: 2 }).textContent).toBe("Who");
    });
  });

  it("moves between tabs without validating", async () => {
    const { getByRole } = render(<Page steps={{ ...wizard, kind: "tabs" }} />);

    fireEvent.click(getByRole("button", { name: "About you" }));

    await waitFor(() => {
      expect(getByRole("heading", { level: 2 }).textContent).toBe("About you");
    });
  });

  it("draws nothing for steps with no step in them", () => {
    const { container } = render(<Page steps={{ of: [] }} />);

    expect(container.querySelector("h2")).toBeNull();
  });
});
