/**
 * Draws a form from its presentation: every member in order, over the schema resolved against
 * the values in hand.
 */

import { type ReactElement } from "react";

import { withForm } from "@stealthscale/example-form-fields";

import { keyed, Member } from "#member.tsx";
import { checkoutOptions } from "#options.ts";
import { OUTSIDE } from "#paths.ts";
import { checkout, presentation } from "#schema.ts";

/**
 * Draws the members of the presentation over the form handed to it, which is the twenty lines
 * the design calls `<Fields>`, written for this one form with the library's own `withForm`.
 */
export const Fields = withForm({
  ...checkoutOptions,
  props: { presentation, resolved: checkout },
  /**
   * Draws every member in order.
   */
  render: function Fields({ form, presentation: shape, resolved }): ReactElement {
    return (
      <>
        {(shape.of ?? []).map((member) => (
          <Member
            form={form}
            index={OUTSIDE}
            key={keyed(member)}
            member={member}
            resolved={resolved}
            shape={shape}
          />
        ))}
      </>
    );
  },
});
