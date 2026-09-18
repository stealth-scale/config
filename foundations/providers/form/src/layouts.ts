/**
 * Types the components a component package hands the foundation to lay a generated form out: a
 * group, an item of a repeat group, a cell around a field, and a step.
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
   * Whether the steps are a wizard, which validates a step before it is left, or tabs.
   */
  readonly kind: "tabs" | "wizard";

  /**
   * The labels of every step, resolved, in order.
   */
  readonly labels: readonly string[];

  /**
   * Moves to the step at an index. A wizard refuses to move forward while the step being drawn
   * has a field its rules refuse.
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
