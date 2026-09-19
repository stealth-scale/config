/**
 * Draws the panel a palette sits in, and holds the actions and what is left of them.
 *
 * @remarks
 *   The palette is a field owning a list rather than a menu. That is the difference a screen reader
 *   hears: a menu is a set of commands a reader walks, and a letter pressed there jumps to a row
 *   rather than narrowing to it, so a person cannot type and walk at once. Typing here moves the
 *   highlight without the field losing focus, which is the pattern the APG names for a field that
 *   owns a list.
 *   Nothing stays marked unless a caller asks. Running a command and picking a value are different
 *   things, and a palette that kept the last command chosen would read it back the next time it
 *   opened as though the page were still doing it.
 */

import { type ComponentProps, type ReactElement } from "react";

import { Listbox } from "@stealthscale/component-collections";

import { type CommandAction } from "#command/action.ts";
import { withProvider } from "#command/context.ts";
import { CommandProvider, useCommandState } from "#command/state.ts";

/**
 * Draws the panel and sets the variants every part below it reads.
 */
const Panelled = withProvider("div", "root");

/**
 * Says how many matches are left, in English, where a caller states nothing else.
 *
 * @param matches - How many actions are still listed.
 * @returns The line a screen reader says after each keystroke.
 */
function counted(matches: number): string {
  return matches === 1 ? "1 result" : `${String(matches)} results`;
}

/**
 * Describes what the panel takes.
 */
export interface RootProps extends Omit<ComponentProps<typeof Panelled>, "onSelect"> {
  /**
   * Everything the palette can be told to do.
   */
  readonly actions: readonly CommandAction[];

  /**
   * The words a screen reader says on reaching the list, naming what the palette is for.
   */
  readonly "aria-label": string;

  /**
   * How many matches are left, said out loud after each keystroke.
   */
  readonly count?: ((matches: number) => string) | undefined;

  /**
   * Hears that an action was chosen, and is handed the value it carries.
   */
  readonly onRun?: ((value: string) => void) | undefined;
}

/**
 * Offers everything a page can be told to do, narrowed by what a person types.
 *
 * @param props - The actions, what the palette is for, and everything a styled div takes.
 * @returns The panel, holding the field and the list.
 */
export function Root({
  actions,
  "aria-label": label,
  children,
  count = counted,
  onRun,
  ...rest
}: RootProps): ReactElement {
  const palette = useCommandState({ actions, count, label });

  return (
    <CommandProvider value={palette}>
      <Panelled {...rest}>
        <Listbox.Root
          collection={palette.collection}
          onSelect={(details) => {
            onRun?.(details.value);
          }}
          selectionMode="single"
          value={[]}
        >
          {children}
        </Listbox.Root>
      </Panelled>
    </CommandProvider>
  );
}
