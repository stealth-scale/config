/**
 * Draws a group of a generated form once per item of the array it repeats over, with the
 * controls that add and remove an item.
 */

import { type ReactElement, type ReactNode, useEffect, useRef } from "react";

import { useSelector } from "@tanstack/react-form";

import { useAnyForm } from "#contexts.ts";
import { defaultsOf } from "#defaults.ts";
import { focusControl } from "#form-defaults.ts";
import { memberPaths } from "#presentation-of.ts";
import { type Group } from "#presentation.ts";
import { bound, countAt, propertyOf } from "#property.ts";
import { describedForm } from "#registry.ts";

/**
 * Describes what a repeat group is given.
 */
export interface RepeatGroupProps {
  /**
   * Draws the group's members, bound to the item at the indices given.
   */
  readonly draw: (indices: readonly number[]) => ReactNode;

  /**
   * The group, which names the array path it repeats over.
   */
  readonly group: Group;

  /**
   * The indices of the items of the repeat groups around this one, outermost first.
   */
  readonly indices: readonly number[];

  /**
   * The legend, resolved, or nothing where the group draws no fieldset.
   */
  readonly legend: string | undefined;

  /**
   * The array path the group repeats over.
   */
  readonly repeat: string;
}

/**
 * Describes the array operations a repeat group calls on the form.
 *
 * @remarks
 *   The library types the array paths of a form over any values as `never`. A method is compared
 *   both ways, which is what lets that form satisfy this shape.
 */
interface ArrayOperations {
  /**
   * Pushes an item onto an array field.
   */
  // eslint-disable-next-line typescript/method-signature-style -- a method is compared both ways, which is what lets a form typed over any values satisfy this shape
  pushFieldValue(field: string, value: unknown): void;

  /**
   * Removes the item at an index of an array field.
   */
  // eslint-disable-next-line typescript/method-signature-style -- the same, for the removal
  removeFieldValue(field: string, index: number): Promise<void>;
}

/**
 * Draws a group once per item of the array it repeats over.
 *
 * @remarks
 *   The group subscribes to the number of items alone, so a keystroke inside an item re-renders
 *   the item's field and not the group. An added item starts from the item schema's own defaults
 *   and takes focus on its first field once it is drawn, so a keyboard user is not left at the
 *   button. The library removes an item through its own `removeFieldValue`.
 */
export function RepeatGroup({
  draw,
  group,
  indices,
  legend,
  repeat,
}: RepeatGroupProps): ReactElement {
  const form = useAnyForm();
  const arrays: ArrayOperations = form;
  const { engine, layouts, schema } = describedForm(form);
  const name = bound(repeat, indices);
  const count = useSelector(form.store, (state) => countAt(state.values, name));
  const added = useRef(false);
  const [first] = memberPaths(group.of);

  useEffect(() => {
    if (!added.current) return;

    added.current = false;

    if (first !== undefined) focusControl(bound(first, [...indices, count - 1]));
  }, [count, first, indices]);

  const { Group: Layout, Item } = layouts;

  /**
   * Adds an item built from the item schema's defaults, and notes that the last item is the one
   * to focus once it is drawn.
   */
  const add = (): void => {
    added.current = true;
    arrays.pushFieldValue(
      name,
      defaultsOf(propertyOf(schema, `${repeat}[]`) ?? {}, undefined, engine),
    );
  };

  return (
    <Layout closed={group.closed} legend={legend} onAdd={add}>
      {Array.from({ length: count }, (_, at) => (
        // eslint-disable-next-line react/no-array-index-key -- an item has no identity but its index, which is the name the form binds it by
        <Item index={at} key={at} onRemove={() => void arrays.removeFieldValue(name, at)}>
          {draw([...indices, at])}
        </Item>
      ))}
    </Layout>
  );
}
