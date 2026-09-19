/**
 * Describes one thing a command palette can be told to do.
 */

import { type ReactNode } from "react";

/**
 * Describes one action, as a palette lists and runs it.
 */
export interface CommandAction {
  /**
   * Whether it is listed but cannot be run.
   */
  disabled?: boolean | undefined;

  /**
   * Which heading it is listed under. Left out, it is listed on its own where it was written.
   */
  group?: string | undefined;

  /**
   * A mark drawn before the words, for a reader scanning rather than reading.
   */
  icon?: ReactNode;

  /**
   * Words that should find it beyond its own, so `add` finds `New document`.
   */
  keywords?: string | undefined;

  /**
   * The words a reader types towards and a screen reader reads out.
   */
  label: string;

  /**
   * The keystroke that runs it without the palette, drawn at the end of the row.
   */
  shortcut?: string | undefined;

  /**
   * The value the palette hands back when this action is chosen.
   */
  value: string;
}

/**
 * Reads the words an action is listed and announced by.
 *
 * @remarks
 *   Written out rather than passed as an arrow at the call site, so the collection's identity does
 *   not change on every render and the rows are not rebuilt for a keystroke that matched nothing.
 * @returns The action's label.
 */
export function labelOf(action: CommandAction): string {
  return action.label;
}

/**
 * Reads the value an action is chosen by, which is what the palette hands back.
 *
 * @returns The action's value.
 */
export function valueOf(action: CommandAction): string {
  return action.value;
}

/**
 * Gathers actions under the heading each one names, keeping the order they were given.
 *
 * @remarks
 *   An action naming no heading is gathered under the empty string, which the list draws without a
 *   heading above it. The order of the headings is the order their first action appeared, so a
 *   caller decides what a reader sees first by the order they write.
 * @param actions - The actions left after what was typed.
 * @returns One entry per heading, holding the actions under it.
 */
export function gathered(
  actions: readonly CommandAction[],
): ReadonlyArray<[heading: string, actions: readonly CommandAction[]]> {
  const under = new Map<string, CommandAction[]>();

  for (const action of actions) {
    const heading = action.group ?? "";
    const already = under.get(heading);

    if (already === undefined) {
      under.set(heading, [action]);
    } else {
      already.push(action);
    }
  }

  return [...under];
}
