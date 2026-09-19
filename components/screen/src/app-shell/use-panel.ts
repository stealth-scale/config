/**
 * Works out what one panel is doing, and writes it to the shell.
 *
 * @remarks
 *   A panel answers three questions: whether the shell is wide enough to hold it beside the page,
 *   whether it is open, and whether anything else is over the page in front of it. The first is
 *   measured off the shell's own element, the second is the caller's where the caller states it,
 *   and the third is read back out of the store every panel writes to. The measurement is taken on
 *   the shell rather than on the window, so a shell drawn in a frame or a catalogue folds on the
 *   room it was given.
 */

import { type RefObject, useCallback, useId, useMemo, useRef } from "react";

import { useControllableState, useSafeLayoutEffect } from "@stealthscale/hooks";
import { type Breakpoint, useNarrow, widthOf } from "@stealthscale/provider-viewport";

import { useKeys } from "#app-shell/keys.ts";
import { type Panel } from "#app-shell/panels.ts";
import { useRevealed } from "#app-shell/revealed.ts";
import { type Collapse, type Fold, type Side, useOverlaid, useShell } from "#app-shell/state.ts";
import { useFocused } from "#focus/index.ts";

/**
 * The width each side stops fitting beside the page under, where the panel states none.
 *
 * @remarks
 *   Navigation folds on a phone. What goes with the page folds on anything narrower than a desk,
 *   because a page squeezed between navigation and detail reads as neither.
 */
const FOLDS_BELOW: Readonly<Record<Side, Breakpoint>> = { end: "lg", start: "md" };

/**
 * Describes what a panel takes.
 */
export interface PanelOptions {
  /**
   * How much of the panel closing it in the body leaves: nothing, or a rail wide enough for the
   * marks inside it. Default: nothing.
   */
  readonly collapse?: Collapse | undefined;

  /**
   * Whether the panel starts open, where nothing controls it. Default: open.
   */
  readonly defaultOpen?: boolean | undefined;

  /**
   * Where the panel goes where the shell is too narrow to hold it beside the page: over it behind a
   * backdrop, or under it as a block. Default: over it.
   */
  readonly folds?: Fold | undefined;

  /**
   * The breakpoint whose width the shell stops holding the panel beside the page under. Default:
   * `md` on the start side and `lg` on the end side.
   */
  readonly foldsBelow?: Breakpoint | undefined;

  /**
   * The name a trigger elsewhere in the shell points at. Default: `navbar` on the start side and
   * `aside` on the end side.
   */
  readonly name?: string | undefined;

  /**
   * Hears the panel open and close.
   */
  readonly onOpenChange?: ((open: boolean) => void) | undefined;

  /**
   * Whether the panel is open, where the application controls it.
   */
  readonly open?: boolean | undefined;

  /**
   * A key that opens and closes the panel with the platform's modifier held: `b` for ⌘B or Ctrl+B.
   * Nothing by default.
   */
  readonly shortcut?: string | undefined;
}

/**
 * Describes what the panel's element is drawn with.
 */
export interface Drawn {
  /**
   * Whether the panel takes neither a press nor a Tab: closed to nothing in the body, closed over
   * the page, or standing behind another panel that is over the page.
   */
  readonly inert: boolean;

  /**
   * The panel as the shell and its own parts read it.
   */
  readonly panel: Panel;
}

/**
 * Reads whether a panel takes neither a press nor a Tab.
 */
function inertness(panel: Panel, collapse: Collapse, behind: boolean): boolean {
  return behind || (!panel.open && (panel.overlaid || collapse === "hide"));
}

/**
 * Reads whether a panel is open, whichever way it is shown.
 *
 * @remarks
 *   A panel over the page keeps its own answer, because a sheet is shown because a reader asked for
 *   it and what the panel was doing in the body says nothing about that. An application that states
 *   `open` overrules that, because a caller that has taken the state has taken it at every width. A
 *   panel under the page is always shown, because there is nothing to open it with and nothing it
 *   would uncover.
 */
function useShown(
  overlaid: boolean,
  stacked: boolean,
  options: PanelOptions,
): [boolean, Panel["setOpen"]] {
  const sheet = overlaid && options.open === undefined;
  const [held, setHeld] = useControllableState({
    defaultValue: options.defaultOpen ?? true,
    onChange: options.onOpenChange,
    value: options.open,
  });
  const [revealed, setRevealed] = useRevealed(sheet);
  const setOpen = useCallback(
    (next: boolean): void => {
      if (sheet) setRevealed(next);
      else setHeld(next);
    },
    [setHeld, setRevealed, sheet],
  );

  return [stacked || (sheet ? revealed : held), setOpen];
}

/**
 * Wraps a panel's setter so that opening it writes down where the reader was standing.
 *
 * @remarks
 *   The note is taken while the press that asked for the panel is still being handled. A sheet
 *   makes the rest of the shell inert, and a browser takes focus off anything it has just made
 *   inert, so a look at the document one render later would find the body rather than the control
 *   that was pressed.
 */
function useAsked(setShown: Panel["setOpen"]): [RefObject<HTMLElement | null>, Panel["setOpen"]] {
  const asked = useRef<HTMLElement | null>(null);
  const setOpen = useCallback(
    (next: boolean): void => {
      const standing = document.activeElement;

      if (next) asked.current = standing instanceof HTMLElement ? standing : null;

      setShown(next);
    },
    [setShown],
  );

  return [asked, setOpen];
}

/**
 * Works out what one panel is doing and writes it to the shell for the rest of it to read.
 *
 * @remarks
 *   Whether the reader is taken into the panel is read back out of the store rather than off the
 *   panel's own state. The bars and the page go inert on what the store says, one commit after the
 *   panel decides, and a browser refuses to focus anything inert. Reading the same signal is what
 *   keeps the two in step: the reader is taken in only once everything else has gone inert, and
 *   handed back only once it has stopped being inert.
 * @param side - Which side of the page the panel sits on.
 * @param options - How the panel folds and closes.
 * @param inner - The element the panel's contents sit in, which the reader is taken into while the
 *   panel is over the page.
 * @returns The panel as the shell reads it, and whether its element takes a press.
 */
export function usePanel(
  side: Side,
  options: PanelOptions,
  inner: RefObject<HTMLDivElement | null>,
): Drawn {
  const { collapse = "hide", folds = "over" } = options;
  const name = options.name ?? (side === "start" ? "navbar" : "aside");
  const shell = useShell();
  const below = options.foldsBelow ?? FOLDS_BELOW[side];
  const narrow = useNarrow(shell.root, widthOf(below), below);
  const overlaid = narrow && folds === "over";
  const stacked = narrow && folds === "under";
  const [shown, setShown] = useShown(overlaid, stacked, options);
  const [asked, setOpen] = useAsked(setShown);
  const id = useId();
  const panel = useMemo<Panel>(
    () => ({ id, open: shown, overlaid, setOpen, stacked }),
    [id, overlaid, setOpen, shown, stacked],
  );
  const sheets = useOverlaid();
  const sheet = sheets.some((each) => each.id === id);

  useKeys({ open: shown, overlaid, setOpen, shortcut: options.shortcut });
  useFocused(inner, sheet, undefined, asked);
  useSafeLayoutEffect((): (() => void) => {
    shell.panels.publish(name, panel);

    return (): void => {
      shell.panels.publish(name);
    };
  }, [name, panel, shell.panels]);

  return {
    inert: inertness(
      panel,
      collapse,
      sheets.some((each) => each.id !== id),
    ),
    panel,
  };
}
