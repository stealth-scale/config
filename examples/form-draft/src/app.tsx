/**
 * Draws the page: the profile form for one saved profile, and the report of the save.
 */

import { type ReactElement, useState } from "react";

import { FormNameContext } from "@stealthscale/example-form-fields";
import { FormProvider } from "@stealthscale/provider-form";
import { localStore, type SettingStore } from "@stealthscale/settings";

import { ProfileForm } from "#profile-form.tsx";
import { type Profile, readProfile } from "#records.ts";
import { words } from "#words.ts";

/**
 * Describes what the page is given.
 */
export interface AppProps {
  /**
   * The identifier of the profile to edit. The first one where the caller states none.
   */
  readonly id?: string | undefined;

  /**
   * Where the draft is kept. The page's local storage where the caller states none, and a
   * memory store in a specification.
   */
  readonly store?: SettingStore | undefined;
}

/**
 * Draws the page for one saved profile, and reports the save.
 */
export function App({ id = "p-1", store = localStore() }: AppProps): ReactElement {
  const [saved, setSaved] = useState<Profile>();
  const record = readProfile(id);

  return (
    <FormProvider translate={words}>
      <main>
        <h1>Profile</h1>
        <FormNameContext value="profile">
          {record === undefined ? (
            <p role="alert">There is no profile to edit</p>
          ) : saved === undefined ? (
            <ProfileForm onSaved={setSaved} record={record} store={store} />
          ) : (
            <output>Saved {saved.name}</output>
          )}
        </FormNameContext>
      </main>
    </FormProvider>
  );
}
