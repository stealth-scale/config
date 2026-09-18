/**
 * Types the components a component package hands the foundation to lay a generated form out: a
 * group, an item of a repeat group, a cell around a field, a step, and the region the form's own
 * errors are read from.
 *
 * @remarks
 *   Every layout but the cell is given an `id` and writes it on its root element. That is the one
 *   contract the foundation's focus management rests on: a step, an item and the errors region are
 *   found by their id when focus has to move into them.
 */

import { type ComponentType, type ReactNode } from "react";

/**
 * Describes what the component around one field is given.
 */
export interface CellProps {
  /**
   * The field, drawn by its renderer.
   */
  readonly children: ReactNode;

  /**
   * How many columns the field takes, inside a group that states a count.
   */
  readonly span?: number | undefined;
}

/**
 * Describes what the region for the form's own errors is given.
 *
 * @remarks
 *   The region is drawn on every render, empty until an issue at the root of the schema or a form
 *   validator refuses the whole value, so it is on the page before its words change and a screen
 *   reader announces them. It carries `role="alert"` and `tabIndex={-1}`, because a refused submit
 *   that no field accounts for moves focus to it.
 */
export interface ErrorsProps {
  /**
   * The errors, resolved to words, or none.
   */
  readonly errors: readonly string[];

  /**
   * The id the region carries, which the foundation finds it by.
   */
  readonly id: string;
}

/**
 * Describes what the component around a group is given.
 */
export interface GroupProps {
  /**
   * The group's members, drawn.
   */
  readonly children: ReactNode;

  /**
   * Whether the group starts closed, which draws it as a disclosure.
   */
  readonly closed?: boolean | undefined;

  /**
   * How many columns the members are laid across.
   */
  readonly columns?: number | undefined;

  /**
   * Whether the members run down the page or across it.
   */
  readonly direction?: "column" | "row" | undefined;

  /**
   * The id the group's root element carries, which the foundation finds it by.
   */
  readonly id: string;

  /**
   * The legend, resolved, or nothing where the group draws no fieldset.
   */
  readonly legend?: string | undefined;

  /**
   * Adds an item, which a repeat group is given and any other group is not. A repeat group
   * holding as many items as its array allows is given none either.
   */
  readonly onAdd?: (() => void) | undefined;
}

/**
 * Describes what the component around one item of a repeat group is given.
 */
export interface ItemProps {
  /**
   * The item's members, drawn.
   */
  readonly children: ReactNode;

  /**
   * The id the item's root element carries, which the foundation finds it by.
   */
  readonly id: string;

  /**
   * The item's index, from zero.
   */
  readonly index: number;

  /**
   * Removes the item. Absent where the array allows no fewer items than it holds.
   */
  readonly onRemove?: (() => void) | undefined;
}

/**
 * Describes what the component around the step being drawn is given.
 *
 * @remarks
 *   Focus moves into the step once a person has moved to it: to the first element inside the
 *   root that can take focus. A layout that gives its heading `tabIndex={-1}` has the step's name
 *   read out before the first field, which is what a wizard wants.
 */
export interface StepProps {
  /**
   * The step's members, drawn.
   */
  readonly children: ReactNode;

  /**
   * The index of the step being drawn.
   */
  readonly current: number;

  /**
   * The id the step's root element carries, which the foundation finds it by.
   */
  readonly id: string;

  /**
   * Whether the steps are a wizard, which validates a step before it is left, or tabs.
   */
  readonly kind: "tabs" | "wizard";

  /**
   * The labels of every step, resolved, in order.
   */
  readonly labels: readonly string[];

  /**
   * Moves to the step at an index. A wizard refuses to move forward while the step being drawn
   * has a field its rules refuse, and refuses to move more than one step forward at a time.
   */
  readonly onGo: (index: number) => void;
}

/**
 * Describes the components that lay a generated form out.
 */
export interface Layouts {
  /**
   * Draws the component around one field.
   */
  readonly Cell: ComponentType<CellProps>;

  /**
   * Draws the region the form's own errors are read from.
   */
  readonly Errors: ComponentType<ErrorsProps>;

  /**
   * Draws a group: a fieldset where it has a legend, and a layout alone where it has none.
   */
  readonly Group: ComponentType<GroupProps>;

  /**
   * Draws one item of a repeat group, with the control that removes it.
   */
  readonly Item: ComponentType<ItemProps>;

  /**
   * Draws the step being drawn, with the controls that move between steps.
   */
  readonly Step: ComponentType<StepProps>;
}
