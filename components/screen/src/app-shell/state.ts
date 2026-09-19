/**
 * Carries the shell down to its parts, and one panel down to what it holds.
 *
 * @remarks
 *   Two contexts. The shell's reaches every part and holds the store the panels write to and the
 *   element they measure themselves against. A panel's reaches only what that panel holds, so a
 *   rail on its edge knows which panel it is on without being told.
 */

import { type RefObject, useMemo } from "react";

import { createRequiredContext } from "@stealthscale/hooks";

import { type Panel, type PanelStore, usePanels } from "#app-shell/panels.ts";

/**
 * The two sides of the page a panel sits on.
 */
export type Side = "end" | "start";

/**
 * How much of a panel closing it in the body leaves: nothing, or a rail wide enough for the marks
 * inside it.
 */
export type Collapse = "hide" | "icons";

/**
 * Lists what closing a panel leaves, for a specification and a README to read.
 */
export const COLLAPSES: readonly Collapse[] = ["hide", "icons"];

/**
 * Where a panel goes when the shell is too narrow to hold it beside the page.
 *
 * @remarks
 *   `over` lays it over the page behind a backdrop, which is what navigation does on a phone.
 *   `under` drops it under the page as a block that is always shown, which is how a panel of detail
 *   about the page reads on a phone.
 */
export type Fold = "over" | "under";

/**
 * Lists where a folded panel goes, for a specification and a README to read.
 */
export const FOLDS: readonly Fold[] = ["over", "under"];

/**
 * Describes what every part of a shell reads.
 */
export interface ShellState {
  /**
   * The store the panels write what they are doing to.
   */
  readonly panels: PanelStore;

  /**
   * The shell's own element, which each panel measures itself against.
   *
   * @remarks
   *   The root rather than the window, so a shell drawn in a frame or a catalogue collapses on the
   *   room it was given. The root is as wide as the shell whatever its panels do, so a panel
   *   opening never changes the measurement that decided whether it could open.
   */
  readonly root: RefObject<HTMLDivElement | null>;
}

/**
 * Hands the shell to its parts, and reads it back.
 */
export const [ShellProvider, useShell] = createRequiredContext<ShellState>("AppShell.Root");

/**
 * Hands one panel to what it holds, and reads it back.
 */
export const [PanelProvider, useNearestPanel] = createRequiredContext<Panel>("an AppShell panel");

/**
 * Reads one panel of the shell by the name it was drawn under.
 *
 * @remarks
 *   What an application reads to close its navigation when a destination is pressed, or to keep
 *   what a reader last opened. Nothing is answered for a name no panel was drawn under and for the
 *   render in which a panel first draws, because a panel writes itself to the store once it is laid
 *   out.
 * @param name - The name the panel was drawn under.
 * @returns The panel, or nothing where none by that name is drawn.
 */
export function useAppShellPanel(name: string): Panel | undefined {
  return usePanels(useShell().panels)[name];
}

/**
 * Reads the panels that are laid over the page and shown.
 *
 * @remarks
 *   What the body reads to draw its backdrop, and what every part behind the backdrop reads to make
 *   itself inert. A panel over the page is read the way a sheet is, so nothing behind it takes a
 *   press or a Tab.
 * @returns The panels over the page, which is usually none.
 */
export function useOverlaid(): readonly Panel[] {
  const panels = usePanels(useShell().panels);

  return useMemo(
    () => Object.values(panels).filter((panel) => panel.open && panel.overlaid),
    [panels],
  );
}
