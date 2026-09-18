/**
 * Draws the second step, the bio and a new password, with the way back and the submit.
 */

import { type ReactElement } from "react";

import { withForm } from "@stealthscale/example-form-fields";

import { nothing, profileOptions } from "#options.ts";

/**
 * Draws the second step over the form handed to it.
 */
export const AboutStep = withForm({
  ...profileOptions,
  props: { onBack: nothing },
  /**
   * Draws the two fields, the way back and the submit.
   */
  render: function AboutStep({ form, onBack }): ReactElement {
    return (
      <>
        <form.AppField name="bio">{(field) => <field.Text />}</form.AppField>
        <form.AppField name="newPassword">
          {(field) => <field.Text type="password" />}
        </form.AppField>
        <p className="steps">
          <button onClick={onBack} type="button">
            Back
          </button>
          <form.Submit>Save</form.Submit>
        </p>
      </>
    );
  },
});
