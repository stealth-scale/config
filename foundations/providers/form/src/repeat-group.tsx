/**
 * Draws a group of a generated form once per item of the array it repeats over, with the
 * controls that add and remove an item.
 */

import { type ReactElement, type ReactNode, useEffect, useId, useRef } from "react";

import { useSelector } from "@tanstack/react-form";

import { useAnyForm } from "#contexts.ts";
import { defaultsOf } from "#defaults.ts";
import { focusInside } from "#focus.ts";
import { memberPaths } from "#presentation-of.ts";
import { type Group } from "#presentation.ts";
import { bound, countAt, propertyOf } from "#property.ts";
import { useDescribedForm } from "#registry.ts";
import { type Schema } from "#schema.ts";

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
 * Reads a bound the array's schema states on how many items it holds, or nothing.
 */
function boundOf(array: Schema | undefined, keyword: "maxItems" | "minItems"): number | undefined {
  const stated = array?.[keyword];

  return typeof stated === "number" ? stated : undefined;
}

/**
 * Writes the id of one item of a group, from the group's own.
 */
function itemId(group: string, index: number): string {
  return `${group}-${String(index)}`;
}

/**
 * The index noted where no item is waiting to take focus.
 */
const NONE = -1;

/**
 * Draws a group once per item of the array it repeats over.
 *
 * @remarks
 *   The group subscribes to the number of items alone, so a keystroke inside an item re-renders
 *   the item's field and not the group. An added item starts from the item schema's own defaults
 *   and takes focus on its first control once it is drawn, so a keyboard user is not left at the
 *   button, unless the group has no field, when focus stays where it was. A removed item hands
 *   focus to the item now at its index, to the last item where it was the last, and to the
 *   group's own controls where none remain, so focus is never dropped on the page. The library
 *   removes an item through its own `removeFieldValue`. The add
 *   control is withheld once the array holds its `maxItems`, and the remove controls are
 *   withheld while it holds no more than its `minItems`, so a person is not offered a change the
 *   schema refuses.
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
  const { engine, layouts, schema } = useDescribedForm(form);
  const id = useId();
  const name = bound(repeat, indices);
  const count = useSelector(form.store, (state) => countAt(state.values, name));
  const pending = useRef(NONE);
  const array = propertyOf(schema, repeat);
  const most = boundOf(array, "maxItems");
  const least = boundOf(array, "minItems");

  useEffect(() => {
    const target = pending.current;

    if (target === NONE) return;

    pending.current = NONE;

    const index = Math.min(target, count - 1);

    focusInside(index < 0 ? id : itemId(id, index));
  }, [count, id]);

  const { Group: Layout, Item } = layouts;

  /**
   * Adds an item built from the item schema's defaults, and notes that the new last item is the
   * one to focus once it is drawn, where the group has a field to focus.
   */
  const add = (): void => {
    if (memberPaths(group.of).length > 0) pending.current = count;

    arrays.pushFieldValue(
      name,
      defaultsOf(propertyOf(schema, `${repeat}[]`) ?? {}, undefined, engine),
    );
  };

  /**
   * Removes the item at an index, where the array allows fewer items than it holds, and notes
   * that the item taking its place is the one to focus once it is drawn.
   */
  const remover = (at: number): (() => void) | undefined =>
    least !== undefined && count <= least
      ? undefined
      : () => {
          pending.current = at;
          void arrays.removeFieldValue(name, at);
        };

  return (
    <Layout
      closed={group.closed}
      id={id}
      legend={legend}
      onAdd={most !== undefined && count >= most ? undefined : add}
    >
      {Array.from({ length: count }, (_, at) => (
        // eslint-disable-next-line react/no-array-index-key -- an item has no identity but its index, which is the name the form binds it by
        <Item id={itemId(id, at)} index={at} key={at} onRemove={remover(at)}>
          {draw([...indices, at])}
        </Item>
      ))}
    </Layout>
  );
}
