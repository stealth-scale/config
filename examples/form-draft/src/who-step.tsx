/**
 * Draws the first step, the name and the email, and lets a person leave it once both pass.
 */

import { type ReactElement } from "react";

import { withForm } from "@stealthscale/example-form-fields";
import { focusFirstInvalid } from "@stealthscale/provider-form";

import { nothing, profileOptions } from "#options.ts";
import { STEPS } from "#schema.ts";

/**
 * Draws the first step over the form handed to it.
 *
 * @remarks
 *   Leaving the step marks its fields touched, so their errors show, and calls `validateField`
 *   once with the cause `submit`, which runs every form-level validator. Where a field of the
 *   step is refused, focus moves to the first of them and the step stays. Otherwise the page is
 *   told the step was left.
 */
export const WhoStep = withForm({
  ...profileOptions,
  props: { onNext: nothing },
  /**
   * Draws the two fields and the button that leaves the step.
   */
  render: function WhoStep({ form, onNext }): ReactElement {
    /**
     * Leaves the step where every field of it passes.
     */
    const next = async (): Promise<void> => {
      for (const name of STEPS.who) {
        form.setFieldMeta(name, (meta) => ({ ...meta, isTouched: true }));
      }

      await form.validateField("name", "submit");

      if (STEPS.who.some((name) => form.getFieldMeta(name)?.isValid === false)) {
        focusFirstInvalid(form);

        return;
      }

      onNext();
    };

    return (
      <>
        <form.AppField name="name">{(field) => <field.Text />}</form.AppField>
        <form.AppField name="email">{(field) => <field.Text type="email" />}</form.AppField>
        <p className="steps">
          <button onClick={() => void next()} type="button">
            Next
          </button>
        </p>
      </>
    );
  },
});
