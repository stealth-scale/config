/**
 * Types how a form is drawn: the members in order, the groups and steps that hold them, and the
 * settings of one field.
 */

import { type Path } from "#path.ts";

/**
 * Describes how one field is drawn.
 */
export interface Field {
  /**
   * Selects the renderer that draws it, by the name the renderer registered.
   */
  readonly control?: string | undefined;

  /**
   * The message identifier of its help text, where the derived one is wrong.
   */
  readonly description?: string | undefined;

  /**
   * The message identifier of its label, where the derived one is wrong.
   */
  readonly label?: string | undefined;

  /**
   * The renderer's own settings, such as a currency or a list of suggestions. Untrusted, because
   * a plugin writes it and the host draws it.
   */
  readonly options?: Readonly<Record<string, unknown>> | undefined;

  /**
   * The message identifier of its placeholder.
   */
  readonly placeholder?: string | undefined;

  /**
   * How many columns it takes, inside a group that states a count. One where it states none.
   */
  readonly span?: number | undefined;
}

/**
 * Describes a run of members, drawn as a fieldset where it has a legend and as bare layout where it
 * has none.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export interface Group<Values = unknown> {
  /**
   * Whether it starts closed, which draws it as a disclosure. Needs a legend.
   */
  readonly closed?: boolean | undefined;

  /**
   * How many columns its members are laid across.
   */
  readonly columns?: number | undefined;

  /**
   * Whether its members run down the page or across it. Down where it states nothing.
   */
  readonly direction?: "column" | "row" | undefined;

  /**
   * Whether it draws a fieldset, and what the legend reads. `true` draws one and reads
   * `<id>.groups.<name>.legend`. A string names another identifier. Absent draws no fieldset.
   */
  readonly legend?: boolean | string | undefined;

  /**
   * A name, so a second presentation can replace this group rather than the whole list.
   */
  readonly name?: string | undefined;

  /**
   * Lists the members in the order they are drawn.
   */
  readonly of: ReadonlyArray<Member<Values>>;

  /**
   * The array path this group is drawn once per item of, with `[]` in its members bound to each
   * index. A group with one draws the add and remove controls as well, within the `minItems` and
   * `maxItems` the array's schema states.
   */
  readonly repeat?: Path<Values> | undefined;
}

/**
 * Describes one thing a group or a step holds: a field by its path, or a group of more.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export type Member<Values = unknown> = Group<Values> | Path<Values>;

/**
 * Describes one step of a wizard, or one tab.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export interface Step<Values = unknown> {
  /**
   * The message identifier of its label, where the derived one is wrong.
   */
  readonly label?: string | undefined;

  /**
   * The name its identifier is derived from.
   */
  readonly name: string;

  /**
   * Lists the members in the order they are drawn.
   */
  readonly of: ReadonlyArray<Member<Values>>;
}

/**
 * Describes the steps of a form, and which kind they are.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export interface Steps<Values = unknown> {
  /**
   * The kind. A wizard validates a step before it is left, and tabs do not. A wizard where it
   * states none.
   */
  readonly kind?: "tabs" | "wizard" | undefined;

  /**
   * Lists the steps in the order they are walked.
   */
  readonly of: ReadonlyArray<Step<Values>>;
}

/**
 * Describes how a form is drawn.
 *
 * @remarks
 *   A stepped form's members are its steps' members, so `of` beside `steps` is refused when the
 *   presentation is read.
 * @typeParam Values - The form's values, where the form has a type. Then every path is checked
 *   against it. Left `unknown`, a path is a string, which is what a manifest has.
 */
export interface Presentation<Values = unknown> {
  /**
   * Per field, by the path into the values: `email`, `address.city`, `lines[].amount`.
   */
  readonly fields?: Readonly<Partial<Record<Path<Values>, Field>>> | undefined;

  /**
   * The identifier every message identifier of this form begins with.
   */
  readonly id: string;

  /**
   * The members the form draws, in order. Absent, every field the schema lists.
   */
  readonly of?: ReadonlyArray<Member<Values>> | undefined;

  /**
   * How the steps are walked.
   */
  readonly steps?: Steps<Values> | undefined;
}

/**
 * Reports whether a member is a group rather than a path.
 *
 * @typeParam Values - The form's values, or `unknown` for a form without a type.
 */
export function isGroup<Values>(member: Member<Values>): member is Group<Values> {
  return typeof member !== "string";
}
