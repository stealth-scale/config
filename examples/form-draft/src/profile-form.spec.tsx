import { type ReactElement } from "react";

import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { draftKey, FormProvider, schemaHash, writeDraft } from "@stealthscale/provider-form";
import { memoryStore, type SettingStore } from "@stealthscale/settings";

import { ProfileForm } from "#profile-form.tsx";
import { type Profile, readProfile, resetProfiles } from "#records.ts";
import { profile } from "#schema.ts";
import { words } from "#words.ts";

const KEY = draftKey("docs", "profile.p-1");
const HASH = schemaHash(profile);
const RECORD: Profile = { bio: "", email: "roy@example.com", id: "p-1", name: "Roy" };
const saved = vi.fn<(profile: Profile) => void>();

/**
 * Draws the form over the record and the store given.
 */
function Page({ store }: { readonly store: SettingStore }): ReactElement {
  return (
    <FormProvider translate={words}>
      <ProfileForm onSaved={saved} record={RECORD} store={store} />
    </FormProvider>
  );
}

/**
 * Reads the draft in the store, parsed.
 */
function stored(store: SettingStore): unknown {
  const text = store.read(KEY);

  return text === null ? undefined : JSON.parse(text);
}

describe("ProfileForm", () => {
  it("starts from the saved record on the first step", () => {
    const { getByLabelText, getByRole } = render(<Page store={memoryStore()} />);

    expect(getByRole("heading", { level: 2 }).textContent).toBe("Who you are");
    expect(getByLabelText("Name")).toHaveProperty("value", "Roy");
    expect(getByLabelText("Email")).toHaveProperty("value", "roy@example.com");
  });

  it("opens on the step a draft was left on with the values it kept", () => {
    const store = memoryStore();

    writeDraft(store, KEY, {
      hash: HASH,
      step: "about",
      values: { bio: "Hi there", email: "roy@example.com", name: "Roy K" },
    });

    const { getByLabelText, getByRole } = render(<Page store={store} />);

    expect(getByRole("heading", { level: 2 }).textContent).toBe("About");
    expect(getByLabelText("About you")).toHaveProperty("value", "Hi there");
    expect(getByLabelText("New password")).toHaveProperty("value", "");

    fireEvent.click(getByRole("button", { name: "Back" }));

    expect(getByLabelText("Name")).toHaveProperty("value", "Roy K");
  });

  it("writes the draft after a change and the debounce without the password", () => {
    vi.useFakeTimers();

    const store = memoryStore();
    const { getByLabelText } = render(<Page store={store} />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "Roy Klopper" } });

    expect(stored(store)).toBeUndefined();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(stored(store)).toStrictEqual({
      hash: HASH,
      values: { bio: "", email: "roy@example.com", name: "Roy Klopper" },
    });
    vi.useRealTimers();
  });

  it("keeps a person on the first step while a field of it is refused", async () => {
    const store = memoryStore();
    const { getByLabelText, getByRole } = render(<Page store={store} />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "R" } });
    fireEvent.click(getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(getByRole("alert").textContent).toBe("Enter at least two characters");
    });
    expect(getByRole("heading", { level: 2 }).textContent).toBe("Who you are");
  });

  it("writes the step at once when the first step is left", async () => {
    const store = memoryStore();
    const { getByRole } = render(<Page store={store} />);

    fireEvent.click(getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(getByRole("heading", { level: 2 }).textContent).toBe("About");
    });
    expect(stored(store)).toStrictEqual({
      hash: HASH,
      step: "about",
      values: { bio: "", email: "roy@example.com", name: "Roy" },
    });
  });

  it("saves the profile and forgets the draft on submit", async () => {
    const store = memoryStore();

    resetProfiles();
    writeDraft(store, KEY, {
      hash: HASH,
      step: "about",
      values: { bio: "Hi", email: "roy@example.com", name: "Roy" },
    });

    const { getByRole } = render(<Page store={store} />);

    fireEvent.click(getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(saved).toHaveBeenCalledWith({
        bio: "Hi",
        email: "roy@example.com",
        id: "p-1",
        name: "Roy",
      });
    });
    expect(readProfile("p-1")?.bio).toBe("Hi");
    expect(store.read(KEY)).toBeNull();
  });
});
