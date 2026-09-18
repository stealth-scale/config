/**
 * Draws the profile form in two steps: starts from the saved record or the draft, writes the
 * draft as a person types, and saves the record on submit.
 */

import { type ReactElement, useState } from "react";

import { useAppForm, useWords } from "@stealthscale/example-form-fields";
import { defaultsOf, useDraft } from "@stealthscale/provider-form";
import { type SettingStore } from "@stealthscale/settings";

import { AboutStep } from "#about-step.tsx";
import { profileOptions } from "#options.ts";
import { type Profile, writeProfile } from "#records.ts";
import { profile, type ProfileValues, type Step } from "#schema.ts";
import { WhoStep } from "#who-step.tsx";

/**
 * How long after a change the draft is written, in milliseconds.
 */
const DEBOUNCE = 300;

/**
 * Describes what the profile form is given.
 */
export interface ProfileFormProps {
  /**
   * Receives the profile once it is saved.
   */
  readonly onSaved: (profile: Profile) => void;

  /**
   * The saved profile the form starts from.
   */
  readonly record: Profile;

  /**
   * Where the draft is kept.
   */
  readonly store: SettingStore;
}

/**
 * Draws the profile form.
 *
 * @remarks
 *   The draft is kept under the record's identifier, so a draft of one profile never opens over
 *   another. The form starts from the draft's values where there is one and from the record
 *   otherwise, each written over the schema's defaults, which also fills the password back in
 *   because a draft never keeps it. The library's own change listener writes the draft, debounced,
 *   and leaving a step writes the step at once. A submit saves the record and forgets the draft.
 */
export function ProfileForm({ onSaved, record, store }: ProfileFormProps): ReactElement {
  const words = useWords();
  const draft = useDraft<ProfileValues>({
    app: "docs",
    id: `profile.${record.id}`,
    schema: profile,
    store,
  });
  const [chosen, choose] = useState<Step>();
  const { id, ...saved } = record;
  const form = useAppForm({
    ...profileOptions,
    defaultValues: defaultsOf<ProfileValues>(profile, draft.restored?.values ?? saved),
    listeners: {
      onChange: ({ formApi }) => {
        draft.write(formApi.state.values);
      },
      onChangeDebounceMs: DEBOUNCE,
    },
    onSubmit: ({ value }) => {
      const { newPassword: _newPassword, ...rest } = value;

      writeProfile({ ...rest, id });
      draft.clear();
      onSaved({ ...rest, id });
    },
  });
  const step: Step = chosen ?? (draft.restored?.step === "about" ? "about" : "who");

  /**
   * Moves to a step and writes it into the draft at once.
   */
  const go = (next: Step): void => {
    choose(next);
    draft.write(form.state.values, next);
  };

  return (
    <form.AppForm>
      <form.Form>
        <h2>{words.step(step)}</h2>
        {step === "who" ? (
          <WhoStep
            form={form}
            onNext={() => {
              go("about");
            }}
          />
        ) : (
          <AboutStep
            form={form}
            onBack={() => {
              go("who");
            }}
          />
        )}
      </form.Form>
    </form.AppForm>
  );
}
