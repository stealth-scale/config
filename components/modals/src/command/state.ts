/**
 * Holds what a palette knows: the actions left after what was typed, and what to say about them.
 *
 * @remarks
 *   The field and the list both read this and neither owns it. Typing narrows the list, and the
 *   list holds the count the field has to announce, so the two are one piece of state rather than
 *   a message passed between them.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  type ListCollection,
  useFilter,
  useListCollection,
} from "@stealthscale/component-collections";
import { createRequiredContext, useAnnounce, useCallbackRef } from "@stealthscale/hooks";

import { type CommandAction, labelOf, valueOf } from "#command/action.ts";

/**
 * Describes what the parts of a palette read.
 */
export interface CommandState {
  /**
   * The actions that match what has been typed, in the order they were given.
   */
  collection: ListCollection<CommandAction>;

  /**
   * The words naming what the palette is for.
   *
   * @remarks
   *   Carried here and stated on the list itself. The machine points the list at a label element a
   *   palette does not draw, so a name set anywhere else resolves to nothing and the list is
   *   announced as an unnamed one.
   */
  label: string;

  /**
   * Narrows the list to what matches.
   */
  narrow: (typed: string) => void;

  /**
   * The text typed so far, which the field draws.
   */
  typed: string;
}

/**
 * Hands the palette to the field and the list, and reads it back.
 */
export const [CommandProvider, useCommand] = createRequiredContext<CommandState>("Command");

/**
 * Describes what the palette is built from.
 */
export interface CommandOptions {
  /**
   * Everything the palette can be told to do.
   */
  actions: readonly CommandAction[];

  /**
   * How many matches are left, said out loud after each keystroke. Given the count, answers the
   * words to say.
   */
  count: (matches: number) => string;

  /**
   * The words naming what the palette is for.
   */
  label: string;
}

/**
 * Keeps the actions and the text typed, and answers what is left of them.
 *
 * @remarks
 *   The count is announced rather than left to be seen. A field that quietly rewrites the list
 *   under it tells a reader watching the screen everything and a reader listening nothing: they
 *   type, the page reads the letter back, and the eight rows that just became one go unmentioned.
 *   It is said after the list has settled, so the number is the one now on the screen.
 *   Matching folds accents and case the way the locale in force folds them, and an action's own
 *   extra words are matched too, which is what lets `add` find `New document`.
 * @param options - The actions and what to say about how many are left.
 * @returns The palette, as its parts read it.
 */
export function useCommandState(options: CommandOptions): CommandState {
  const { actions, count, label } = options;
  const [typed, setTyped] = useState("");
  const announce = useAnnounce();
  const folded = useFilter();

  const matching = useCallback(
    (words: string, sought: string, action: CommandAction): boolean =>
      folded.contains(words, sought) || folded.contains(action.keywords ?? "", sought),
    [folded],
  );

  const { collection, narrow } = useListCollection<CommandAction>({
    filter: matching,
    itemToString: labelOf,
    itemToValue: valueOf,
    rows: actions,
  });

  const matches = collection.size;

  useEffect(() => {
    if (typed === "") return;

    announce(count(matches));
  }, [announce, count, matches, typed]);

  const narrowed = useCallbackRef((next: string): void => {
    setTyped(next);
    narrow(next);
  });

  return useMemo(
    () => ({ collection, label, narrow: narrowed, typed }),
    [collection, label, narrowed, typed],
  );
}
