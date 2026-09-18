/**
 * Draws one member of the presentation: a field through its renderer, a group as a fieldset or a
 * layout, and a repeat group once per item with the controls to add and remove one.
 */

import { type ReactElement } from "react";

import { useWords, withForm } from "@stealthscale/example-form-fields";
import {
  defaultsOf,
  type Group,
  type Member as Placed,
  useFormEnvironment,
  useSelector,
} from "@stealthscale/provider-form";

import { FieldMember } from "#field-member.tsx";
import { Framed } from "#framed.tsx";
import { checkoutOptions } from "#options.ts";
import { countAt, keyOf, layoutOf, legendOf, OUTSIDE, propertyOf } from "#paths.ts";
import { RepeatItem } from "#repeat-item.tsx";
import { checkout, presentation } from "#schema.ts";

/**
 * Describes the array operations a repeat group calls on the form.
 *
 * @remarks
 *   The form is typed over a record of unknown values, because a generated form has no type, and
 *   the library then types the array paths as `never`. A method is compared both ways, which is
 *   what lets that form satisfy this shape.
 */
interface ArrayOperations {
  /**
   * Pushes an item onto an array field.
   */
  // eslint-disable-next-line typescript/method-signature-style -- a method is compared both ways, which is what lets a form typed over unknown values satisfy this shape
  pushFieldValue(field: string, value: unknown): void;

  /**
   * Removes the item at an index of an array field.
   */
  // eslint-disable-next-line typescript/method-signature-style -- the same, for the removal
  removeFieldValue(field: string, index: number): Promise<void>;
}

/**
 * Answers the member drawn where the page states none, which is an empty group.
 */
function none(): Placed {
  return { of: [] };
}

/**
 * Keys a member for React: a path by itself, and a group by its name or what it holds.
 */
export function keyed(member: Placed): string {
  return typeof member === "string" ? member : keyOf(member);
}

/**
 * Draws one member over the form handed to it.
 *
 * @remarks
 *   A group draws its members through this component again, bound to the item given where the
 *   group is inside a repeat group. A repeat group reads the whole values from the form's store
 *   to count its items, which re-renders it on every change. The component package's own fields
 *   subscribe to the resolved schema's hash instead.
 */
export const Member = withForm({
  ...checkoutOptions,
  props: { index: OUTSIDE, member: none(), resolved: checkout, shape: presentation },
  /**
   * Draws the member.
   */
  render: function Member({ form, index, member, resolved, shape }): ReactElement {
    const words = useWords();
    const { translate } = useFormEnvironment();
    const values = useSelector(form.store, (state) => state.values);
    const arrays: ArrayOperations = form;

    if (typeof member === "string") {
      return (
        <FieldMember form={form} index={index} path={member} resolved={resolved} shape={shape} />
      );
    }

    /**
     * Draws the group's members, bound to the item given.
     */
    const members = (group: Group, at: number): ReactElement[] =>
      group.of.map((child) => (
        <Member
          form={form}
          index={at}
          key={keyed(child)}
          member={child}
          resolved={resolved}
          shape={shape}
        />
      ));
    const legend = legendOf(member, words, translate);
    const path = member.repeat;

    if (path === undefined) {
      return (
        <Framed legend={legend}>
          <div className={layoutOf(member)}>{members(member, index)}</div>
        </Framed>
      );
    }

    return (
      <Framed legend={legend}>
        {Array.from({ length: countAt(values, path) }, (_, at) => (
          // eslint-disable-next-line react/no-array-index-key -- an item has no identity but its index, which is the path the form binds it by
          <RepeatItem key={at} onRemove={() => void arrays.removeFieldValue(path, at)}>
            {members(member, at)}
          </RepeatItem>
        ))}
        <button
          onClick={() => {
            arrays.pushFieldValue(path, defaultsOf(propertyOf(checkout, `${path}[]`) ?? {}));
          }}
          type="button"
        >
          Add
        </button>
      </Framed>
    );
  },
});
