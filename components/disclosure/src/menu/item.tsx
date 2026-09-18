/**
 * Draws one row of the menu.
 *
 * @remarks
 *   A row names itself with `value`, which is the one thing the machine cannot work out for itself.
 *   Everything else is the machine's: the menu item role, whether the highlight is on it, whether a
 *   reader can choose it, and the words typeahead matches it on.
 *   The row hands its name down to the label and the mark inside it, so a caller writes the value
 *   once rather than on all three.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { ItemProvider, useMenu } from "#menu/machine.ts";
import { type Tone } from "#menu/tone.ts";

/**
 * Draws the row at the size the root states.
 */
const Chosen = withContext("div", "item");

/**
 * Describes what a row takes.
 */
export interface ItemProps extends Omit<ComponentProps<typeof Chosen>, "onSelect"> {
  /**
   * Whether choosing the row closes the menu, which it does unless the row says otherwise.
   */
  readonly closeOnSelect?: boolean | undefined;

  /**
   * Whether a reader can choose the row at all.
   */
  readonly disabled?: boolean | undefined;

  /**
   * The purpose of the row, which decides the ink it is drawn in.
   */
  readonly tone?: Tone | undefined;

  /**
   * The value the machine identifies the row by and reports when the reader chooses it.
   */
  readonly value: string;

  /**
   * The words typeahead matches the row on, where they differ from what it shows.
   */
  readonly valueText?: string | undefined;
}

/**
 * Offers one thing a reader can choose.
 *
 * @param props - The row's name and purpose, beside everything a styled div takes.
 * @returns The row, carrying what the machine writes onto it.
 */
export function Item({
  closeOnSelect,
  disabled,
  tone,
  value,
  valueText,
  ...rest
}: ItemProps): ReactElement {
  const { api } = useMenu();
  const state = {
    ...(closeOnSelect === undefined ? {} : { closeOnSelect }),
    ...(disabled === undefined ? {} : { disabled }),
    ...(valueText === undefined ? {} : { valueText }),
    value,
  };

  return (
    <ItemProvider value={state}>
      <Chosen {...mergeProps(api.getItemProps(state), { "data-tone": tone }, rest)} />
    </ItemProvider>
  );
}
